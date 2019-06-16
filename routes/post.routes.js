var express = require('express');
var postdb = require('../models/post.model');
var moment = require('moment');
var catdb = require('../models/category.model');
var Accdb = require('../models/account.model');
var commentdb=  require('../models/comment.model');
var router = express.Router();
// Chuyen 1,2,3,4 => [1,2,3,4]
var ConverArr = (a) => {
   return a.split(",");

}
router.post('/post/tl-comment/:id', (req, res, next)=>{
   var Acc_id= res.locals.authUser.AccID;
   var Postid = req.params.id;
   var id_parent = req.body.parent;
   var content = req.body.cmt;
   var today  =  moment().format('YYYY-MM-DD HH:mm');
   var entity = {
      AccID:Acc_id,Content:content,Date:today,ComParent:id_parent,Status: '1'
   }
   commentdb.add(entity).then(n=>{
      postdb.singleID(Postid).then(rows=>{
         if(rows.length>0){
               var cmlist= rows[0].ListComID;

               cmlist = ConverArr(cmlist);
              
               var list="";
               cmlist.forEach(ele =>{
                     if(ele != id_parent){
                        list+=ele+",";
                     }
               });
               list+=n;

               var entity = {ListComID :list};
               postdb.update(Postid,entity).then(n=>{
                  res.redirect('/post?id='+Postid);
                  return;
               }).catch(next);
         }
      }).catch(next);
   }).catch(next);
});
router.post('/post/add-comment/:id', (req, res, next)=>{
   var Acc_id= res.locals.authUser.AccID;
   var Postid = req.params.id;
   //console.log('id la ' +Postid);
   
   var content = req.body.comment;
      var today  =  moment().format('YYYY-MM-DD HH:mm');
     // console.log(today);
      
   var entity = {
      AccID:Acc_id,Content:content,Date:today,Status: '1'
   }
   commentdb.add(entity).then(Id_comment=>{
     // console.log(Id_comment);
      
         if(Id_comment>0){
            postdb.singleID(Postid).then(rows=>{
               if(rows.length>0){
                     var cmlist= rows[0].ListComID;
                    if(!cmlist){
                     cmlist+=Id_comment;
                    }else{
                     cmlist = cmlist+','+Id_comment;
                    }
                     var entity = {ListComID :cmlist};
                     postdb.update(Postid,entity).then(n=>{
                        res.redirect('/post?id='+Postid);
                        return;
                     }).catch(next);
               }
            }).catch(next);
         }  
   }).catch(next);
   
});
//
router.get('/post', (req, res, next) => {
   var id = req.query.id;
   var user= res.locals.authUser;
   var CheckPre = false;
   if(user != null ){     
      if(user.Type ==0 && !user.DatePremium){
         CheckPre = false;
      }
     else if(user.Type ==0){
    
      var today  =  moment().format('YYYY-MM-DD HH:mm');
      var preday  = new Date(user.DatePremium);
      if(preday <today){
         CheckPre=false;
      }else{
         CheckPre=true;
      }
     }else{
        CheckPre=true;
     }
   }else{
      CheckPre=false;
   }
   postdb.SinglePageById(id).then(row => {
     
      if (row.length == 0) {
         res.redirect('/');
         return;
      }
      var ArrTag;
      var ArrCmt;
      if(row[0].isPremium == 0){
         CheckPre=true;
      }
      //Xet Comment ==0
     // console.log('list comt '+row[0].ListComID);
      
      if (!row[0].ListComID) {
         ArrCmt = '-1,-1';

      } else {
         ArrCmt = row[0].ListComID;
      }
      //Xet tag ==0
      if (row[0].ListTagID.length == 0) {
         ArrTag = '-1,-1';

      } else {
         ArrTag = row[0].ListTagID;
      }
      row[0].DatePost = moment(row[0].DatePost, "YYYY-MM-DD HH:mm").format("DD/MM/YYYY HH:mm");
      var Arr = ConverArr(ArrTag);
      var Arr2 = ConverArr(ArrCmt);

      Promise.all([postdb.AllTag(Arr), postdb.AllComt(Arr2), postdb.PostByCategogy(row[0].CatID, 5,id),
      catdb.singleWithParent(row[0].CatID)
      ]).then(([rows_tag, rows_cmt, rows_cat, Cat]) => {
         var Cmt = [];
         var Check = [];
         rows_cmt.forEach((element, number, rows_cmt) => {
            element.Date = moment(element.Date, "YYYY-MM-DD HH:mm").format("DD/MM/YYYY HH:mm");
            if (element.DateCha != 'null') {
               element.DateCha = moment(element.DateCha, "YYYY-MM-DD HH:mm").format("DD/MM/YYYY HH:mm");
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
         
         
        // console.log(Cmt);
         
         res.render('post', {
            Content: row[0], Tag: rows_tag, Cmt: Cmt, CatRows: rows_cat, Cate: Cat[0],CheckPre
         });
      }).catch(next);
   }
   ).catch(next);
});


module.exports = router;