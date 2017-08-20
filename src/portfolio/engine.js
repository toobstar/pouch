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

function calcGains(tradesForStock) {
    let gainsByDay = [];
    let today = moment();
    let dateCursor = tradesForStock[0].date;
    while (dateCursor.isBefore(today)) {
        tradesForStock.forEach(function (trade) {
            gainsByDay.push(new Gains())
        });
        dateCursor.add(1, 'days');
    }
}
function calcPortfolioGains(portfolio) {
    console.log("portfolio",portfolio);
    let tbs = tradesByStock(portfolio);
    console.log("tradesByStock",tbs);
    for (let stock in tbs) {
        if (tbs.hasOwnProperty(stock)) {
            let gainsByDayForStock = calcGains(tbs[stock]);
        }
    }
}


calcPortfolioGains(portfolio);