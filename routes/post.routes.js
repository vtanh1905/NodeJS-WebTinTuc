var express = require('express');
var postdb = require('../models/post.model');
var moment = require('moment');
var router = express.Router();
// Chuyen 1,2,3,4 => [1,2,3,4]
var ConverArr = (a) => {
   return a.split(",");
  
}

router.get('/post', (req, res, next) => {
   var id = req.query.id;

   postdb.SinglePageById(id).then(row => {
      if(row.length == 0){
         res.redirect('/');
         return;
      }
      var ArrTag ;
      var ArrCmt;
      //Xet Comment ==0
      if(row[0].ListComID.length ==0){
         ArrCmt ='-1,-1';
        
      }else{
         ArrCmt = row[0].ListComID;  
      }
      //Xet tag ==0
      if(row[0].ListTagID.length ==0){
         ArrTag ='-1,-1';
         
      }else{
         ArrTag = row[0].ListTagID;
      }
      row[0].DatePost = moment(row[0].DatePost, "YYYY-MM-DD HH:MM").format("DD/MM/YYYY HH:MM");
      var Arr = ConverArr(ArrTag);
      var Arr2 = ConverArr(ArrCmt);
     
      Promise.all([postdb.AllTag(Arr), postdb.AllComt(Arr2),postdb.PostByCategogy(row[0].CatID,5)]).then(([rows_tag, rows_cmt,rows_cat]) => {
         var Cmt = [];
         var Check = [];
         rows_cmt.forEach((element, number, rows_cmt) => {
            element.Date = moment(element.Date, "YYYY-MM-DD HH:MM").format("DD/MM/YYYY HH:MM");
            if (element.DateCha != 'null') {
               element.DateCha = moment(element.DateCha, "YYYY-MM-DD HH:MM").format("DD/MM/YYYY HH:MM");
            }
            if (element.ComParent == null) {

               var cmtCon = [];
               cmtCon.push(element);
               var CmtLevel = { CmtLevel1: cmtCon[0], CmtLevel2: null, Level2: false };
               Cmt.push(CmtLevel);
            } else {
               var cmtCon = [];

               if (Check.indexOf(element.ComParent) == '-1') {

                  Check.push(element.ComParent);

                  rows_cmt.forEach((element1, number1) => {
                     if (element1.ComParent === element.ComParent) {
                        cmtCon.push(element1);
                     }
                  });
                  var cmtCha = [];
                  cmtCha.push(element);
                  var CmtLevel = { CmtLevel1: cmtCon, CmtLevel2: cmtCha[0], Level2: true };
                  Cmt.push(CmtLevel);
               }
            }
         });
        
         console.log(Cmt);
         
         res.render('post', {
            Content: row[0], Tag: rows_tag, Cmt: Cmt,CatRows : rows_cat
         });
      }).catch(next);
   }
   ).catch(next);
});


module.exports = router;