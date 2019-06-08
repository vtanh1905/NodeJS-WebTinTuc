var express = require('express');
var carddb = require('../../models/card.model');
var accountdb = require('../../models/account.model');
var router = express.Router();
var Handlebars = require('express-handlebars');




// Quản Lý Card
router.get('/card', (req, res, next) => {

    var page = req.query.page || 1;
    var limit = req.query.limit || 5;
    var limit = req.query.limit || 5;
    var offset = (page - 1) * limit;
    var search = req.query.search || "";
    var produce = req.query.productBy || "";
    var Selected = { select: produce };
    console.log("producce  "+produce);
    console.log("search"+search);
    
    var Dem = 0;
    Promise.all([
        carddb.alloffset(limit, offset, search, produce),
        carddb.countAll(search, produce),
    ]).then(([rows, count_rows]) => {

        console.log('rows = ' + rows.length);
        console.log('count rows = ' + count_rows[0].total);
        var CheckXX = [true, false, false];
        total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        var pages = [];
        if (total % limit > 0) nPages++;
        var Check = page - 3;
        if (Check < 1) {
            Check = 1;
        }
        var Dem = 0;
        for (var i = Check; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
            if (i > page) {
                Dem++;
            }
            if (Dem == 3) {
                break;
            }
        }
           
            var pageNext;
            var pagePre;
            if (page < nPages) {
                pageNext = parseInt(page) + 1;
            } else {
                pageNext = 0;
            }
            if (page > 1) {
                pagePre = parseInt(page) - 1;
            } else {
                pagePre = 0;
            }
            if (rows.length > 0) {

                res.render('dashboard/manage/card', {
                    Err: false, cards: rows, pages, pageNext, pagePre, search, produce,
                    helpers: {
                        ifEquals: function (arg1, arg2, options) {
                            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                        }
                    }
                });
            } else {
                res.render('dashboard/manage/card', {
                    Err: true, cards: rows, pages, pageNext, pagePre, search, produce,
                    helpers: {
                        ifEquals: function (arg1, arg2, options) {
                            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                        }
                    }
                }); 
            }
    }).catch(err => {
    });

});
router.post('/card/Xoa/', (req, res, next) => {
    var id = req.body.CardID;
    var entity = { Status: '0' };
    carddb.delete(id, entity).then(n => {
        if (n > 0) {
            res.redirect('/dashboard/card');
        }
    }).catch(next);
});



router.post('/card/GiaHan/', (req, res, next) => {
    var id = req.body.CardID;
    carddb.single('card', 'CardID', id).then(
        row => {
            if (row.length > 0) {
                carddb.single('account', 'AccID', row[0].AccID).then(
                    acc => {
                        var date = acc[0].DatePremium;
                        data = new Date(date);
                        console.log(acc);
                        date = XuLiDate(date, row[0].Value);
                        var entity = { DatePremium: date };
                        accountdb.udpate(acc[0].AccID, entity).then(value => {
                            if (value > 0) {
                                var entity = { Status: '0', Check: '1' };
                                carddb.delete(row[0].CardID, entity).then(n => {
                                    if (n > 0) {
                                        res.redirect('/dashboard/card');
                                    }
                                }).catch(next);
                            }
                        }).catch(next);

                    }
                ).catch(next);

            } else {
                res.end('lol');
            }
        }
    ).catch(next);

});
var curday = (sp) => {
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return (mm + sp + dd + sp + yyyy);
};
var XuLiDate = (date, Value) => {
    var currentday = curday('/');
    if (date == null || date < currentday) {
        console.log('Nho hon');

        date = currentday;
    }
    if (Value == 10000) {
        date.setDate(date.getDate() + 7);

    } else if (Value == 20000) {
        date.setDate(date.getDate() + 30);

    } else if (Value == 50000) {
        date.setMonth(date.getMonth() + 3);

    } else if (Value == 100000) {
        date.setMonth(date.getMonth() + 9);

    } else if (Value == 200000) {
        date.setFullYear(date.getFullYear() + 2);

    } else if (Value == 500000) {

        date.setFullYear(date.getFullYear() + 5);

    }
    return date;
}



module.exports = router;