var express = require('express');
var postdb = require('../../models/post.model');
var router = express.Router();
var moment = require('moment');

// ==================================================================================================================================================================================================================
// Quản Lý Bai Viet
router.post('/post/delete', (req, res, next) => {
    var id = req.body.id_delete;
    var entity = { Status: '0' };
    postdb.update(id, entity).then(n => {
        res.redirect('/dashboard/post');

    }).catch(next);

}),
    router.get('/post', (req, res, next) => {
        var page = req.query.page || 1;
        var status = req.query.Status || 4;
        var search = req.query.Search || "";
        var limit = req.query.Limit || 10;
        var offset = (page - 1) * limit;
        var Check_KiemDuyet = 0;

        Promise.all([postdb.all(status, search, offset, limit), postdb.Countall(status, search)]).then(([rows, count_rows]) => {


            var total = count_rows[0].total;


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
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            rows.forEach((element, number, arr) => {
                var tday = new Date(today);
                var postday = new Date(element.DatePost);
                if(postday <=tday){
                    element.NotYet= false;
                }else{
                    element.NotYet= true;
                }
                element.DatePost = moment(element.DatePost, "YYYY-MM-DD HH:MM").format("DD/MM/YYYY HH:MM");
                var cmt = element.ListComID;
                element.count = (cmt.split(',')).length;
            });
            res.render('dashboard/manage/post', {
                rows, pages, pageNext, pagePre, search, status, limit,
                
                helpers: {
                    ifEquals: function (arg1, arg2, options) {
                        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                    }
                }
            });

        }).catch(next);
    });

router.get('/post/approve', (req, res, next) => {
    res.render('dashboard/manage/post/approve', {});
});
// ==================================================================================================================================================================================================================

module.exports = router;