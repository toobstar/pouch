'use strict';

class Trade {

    constructor(stock, date, units, price) {
        this.stock = stock;
        this.date = date;
        this.dateObj = date.toDate();
        this.units = units;
        this.price = price;
    }

}