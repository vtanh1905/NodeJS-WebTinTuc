var express = require('express');
var postdb = require('../../models/post.model')
var router = express.Router();
var moment = require('moment');
// ==================================================================================================================================================================================================================
// Phê duyệt - START
var ConverArr = (a) => {
    var Temp = [];
    for (var i = 0; i < a.length; i++) {
       if (a.charAt(i) != ',') {
          Temp.push(a.charAt(i));
       }
    }
    return Temp;
 }

router.get('/approve', (req, res, next) =>{
    var account = res.locals.authUser;
    var ComId = account.ManageCatID;
    var page = req.query.page || 1;
    var status = req.query.Status || -1;
    var search = req.query.Search || "";
    var limit = req.query.Limit || 10;
    var offset = (page - 1) * limit;
    if(ComId == null){
        Check_QuanLi = false;
            res.render('dashboard/approve', {Check_QuanLi, search, status, limit,
                helpers: {
                    ifEquals: function (arg1, arg2, options) {
                        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                    }
                }
            });
        
        return;
    }
    var Cat = ConverArr(ComId);
   

   if(isNaN(limit) || isNaN(page) || isNaN(status)){
       res.redirect('/dashboard/approve');
       return;
   }

    postdb.AllCatInArr(Cat).then(rows =>{
        var Check_QuanLi= true;
        //Danh sach thu muc hien thi
        var  CatShow= [];
        //Danh sach ID de lay post
        var CatID= [];
        
        // khong quan li bat ki thu muc nao
        if(rows.length ==0){
            Check_QuanLi = false;
            res.render('dashboard/approve', {Check_QuanLi,rows, search, status, limit,
                helpers: {
                    ifEquals: function (arg1, arg2, options) {
                        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                    }
                }
            });
                return;
        }
        //Lay ten cac thu muc
        rows.forEach(element => {
            var ele = {
                name: element.Name,
                Id :element.CatID
            }
            CatShow.push(ele);                       
    });
        if(status==-1){
            CatID = Cat;
        }else{
            CatID.push(status);
        }
        console.log(CatShow);
        Promise.all([postdb.AllByCatID(search,offset,limit,CatID),postdb.CountAllByCatID(search,CatID)]).then(([rows,rows_count])=>{
            
            if(rows.length ==0){
                Check_QuanLi = false;
                res.render('dashboard/approve', {Check_QuanLi,rows, search, status, limit,
                    helpers: {
                        ifEquals: function (arg1, arg2, options) {
                            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                        }
                    }
                });
                    return;
            }
            
            var total = rows_count[0].total;
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
            rows.forEach((element) => {
                element.DatePost = moment(element.DatePost, "YYYY-MM-DD HH:MM").format("DD/MM/YYYY HH:MM");
                var cmt = element.ListComID;
                if(cmt==null){
               
                    element.count=0;
                }else{
                    if(cmt.length ==0){
                        element.count=0;
                    }else{
                        element.count = (cmt.split(',')).length;
                    }
                    
                }
            });
            Check_QuanLi=true;
            res.render('dashboard/approve', {rows,CatShow,pages, pageNext, pagePre, search, status, limit, Check_QuanLi,
                helpers: {
                    ifEquals: function (arg1, arg2, options) {
                        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                    }
                }
            });

        }).catch(next);

    }).catch(next);
   

});

router.get('/approve/edit', (req, res, next) =>{
    res.render('dashboard/approve/edit', {});
});

// Phê duyệt - END
// ==================================================================================================================================================================================================================


module.exports = router;