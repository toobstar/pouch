'use strict';

let trades = [];
let t1 = new Trade('BHP', moment('2016-01-01'), 100, 35.40);
let t2 = new Trade('ANZ', moment('2016-03-01'), 40, 43.20);
trades.push(t1);
trades.push(t2);
let portfolio = new Portfolio(trades);

function tradesByStock(portfolio) {
    let tradesByStock = {};

    portfolio.trades.forEach(function (trade) {
        console.log("trade",trade);
        if (!tradesByStock[trade.stock]) {
            tradesByStock[trade.stock] = [];
        }
        tradesByStock[trade.stock].push(trade);
    });
    return tradesByStock;
}


let today = moment();
function calcGains(tradesForStock) {
    let openPositions = [];
    let gainsByDay = [];
    let dateCursor = tradesForStock[0].date;
    let stock = tradesForStock[0].stock;
    let unitsCursor = 0;
    while (dateCursor.isBefore(today)) {
        let realisedGains = 0;
        let currentPrice = fetchCurrentPrice(stock, dateCursor);
        tradesForStock.forEach(function (trade) {
            if (trade.date.isSame(dateCursor)) {
                unitsCursor += trade.units;
                if (trade.units > 0) {
                    openPositions.push(trade);
                }
                else {
                    let saleUnits = trade.units;
                    let firstPurchase = openPositions[0];
                    if (firstPurchase.units + saleUnits > 0) { // still units left over after selling now
                        firstPurchase.units = firstPurchase.units + saleUnits;
                        realisedGains = calcRealisedGain(realisedGains, firstPurchase.price, currentPrice);
                    }
                    else if (firstPurchase.units + saleUnits == 0) { // sale matches initial purchase
                        firstPurchase.units = firstPurchase.units + saleUnits;
                        realisedGains = calcRealisedGain(realisedGains, firstPurchase.price, currentPrice);
                    }
                    else { // sale more than initial purchase
                        firstPurchase.units = firstPurchase.units + saleUnits;
                        realisedGains = calcRealisedGain(realisedGains, firstPurchase.price, currentPrice);

                        let secondPurchase = openPositions[1];
                    }
                }
            }

        });


        gainsByDay.push(new Gains())
        dateCursor.add(1, 'days');
    }
    return gainsByDay;
}
function calcPortfolioGains(portfolio) {
    console.log("portfolio",portfolio);
    let tbs = tradesByStock(portfolio);
    console.log("tradesByStock",tbs);
    for (let stock in tbs) {
        if (tbs.hasOwnProperty(stock)) {
            let gainsByDayForStock = calcGains(tbs[stock]);
            console.log("gainsByDayForStock",gainsByDayForStock);
        }
    }
}


calcPortfolioGains(portfolio);