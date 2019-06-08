var express = require('express');
var postdb = require('../models/post.model');
var moment = require('moment');
var router = express.Router();
var ConverArr = (a) => {
   var Temp = [];
   for (var i = 0; i < a.length; i++) {
      if (a.charAt(i) != ',') {
         Temp.push(a.charAt(i));
      }
   }
   return Temp;
}

router.get('/post', (req, res, next) => {
   var Arr2 = [1, 2, 3, 4];

   var id = req.query.id;
   postdb.SinglePageById(id).then(row => {

      var ArrTag = row[0].ListTagID;
      var ArrCmt = row[0].ListComID;
      row[0].DatePost = moment(row[0].DatePost, "YYYY-MM-DD HH:MM").format("DD/MM/YYYY HH:MM");
      var Arr = ConverArr(ArrTag);
      var Arr2 = ConverArr(ArrCmt);
      console.log('tag list');
      console.log(Arr);
      
      Promise.all([postdb.AllTag(Arr), postdb.AllComt(Arr2)]).then(([rows_tag, rows_cmt]) => {

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

         Cmt.forEach(rows => {
            console.log(rows);
         });
         console.log('tag name');
         console.log(rows_tag);
         res.render('post', {
            Content: row[0], Tag: rows_tag, Cmt: Cmt
         });
      }).catch(next);
   }
   ).catch(next);
});


module.exports = router;