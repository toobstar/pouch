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

function filterForToday(trades, dateCursor) {
    let filtered = [];
    trades.forEach(function (trade) {
        if (trade.date.isSame(dateCursor)) {
            filtered.push(trade);
        }
    });
    return filtered;
}

function fetchIncome(stock, dateCursor) {
    return 1;
}
function fetchPrice(stock, dateCursor) {
    return 15;
}

function processSale(gains, openPositions, saleUnits, currentPrice) {
    let firstPurchase = openPositions[0];
    let unitsLeftAfterSale = firstPurchase.units + saleUnits;
    if (unitsLeftAfterSale > 0) {
        firstPurchase.units = firstPurchase.units + saleUnits;
        gains.realisedGains += calcRealisedGain(realisedGains, firstPurchase.price, currentPrice);
        return 0;
    }
    else { // sale matches or more than initial purchase
        gains.realisedGains = calcRealisedGain(realisedGains, firstPurchase.price, currentPrice);
        openPositions.shift(); // clear open position trade for this
        let unitsRemainingToProcess = saleUnits - firstPurchase.units;
        return unitsRemainingToProcess;
    }
}

let today = moment();
function calcGains(tradesForStock) {
    let openPositions = [];
    let gainsByDay = [];
    let dateCursor = tradesForStock[0].date;
    let stock = tradesForStock[0].stock;
    while (dateCursor.isBefore(today)) {
        let gains = new Gains(dateCursor, 0, 0, 0);

        let priceForCursorDate = fetchPrice(stock, dateCursor);
        let incomeForCursorDate = fetchIncome(stock, dateCursor);
        let tradesForCursorDate = filterForToday(tradesForStock, dateCursor);

        tradesForCursorDate.forEach(function (trade) {
            if (trade.units > 0) { // purchase
                openPositions.push(trade);
            }
            else { // sale
                let saleUnits = trade.units;
                while (saleUnits > 0 && openPositions.length > 0) {
                    saleUnits = processSale(gains, openPositions, saleUnits, priceForCursorDate);
                }
            }
        });

        openPositions.forEach(function (trade) {
            gains.unrealised += trade.units * (priceForCursorDate-trade.price);
            gains.income += trade.units * incomeForCursorDate;
        });

        gainsByDay.push(gains);
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