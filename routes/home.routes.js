var express = require("express");
var post_model = require("../models/post.model");
var tag_model = require("../models/tag.model");
var moment = require("moment");

var router = express.Router();

router.get("/", (req, res, next) => {
  // 10 Bài Viết Mới Nhất Mọi Chuyên Mục
  Promise.all([post_model.getNewPosts(0), tag_model.getAll(), post_model.getFourImpressPost(), post_model.getTop10Post(), post_model.getNewestPostPerCat()])
    .then(([ListNewsPost, ListTag,impressPost, top10PostByView,newestPost]) => {
      ListNewsPost.forEach(element => {
        //Fomat DateTime
        element.DatePost = moment(element.DatePost, "YYYY-MM-DD HH:mm").format(
          "DD/MM/YYYY HH:mm"
        );

        //Lay Du Lieu Tag
        element.ListTag = [];
        element.ListTagID = element.ListTagID.split(",");
        element.ListTagID.forEach(x => {
          var ObjectTag = {};
          ListTag.forEach(y => {
            if (y.TagID === +x) {
              ObjectTag.ID = y.TagID;
              ObjectTag.Name = y.Name
              return;
            }
          });
          element.ListTag.push(ObjectTag);
        });
      });
      for(var i of impressPost){
        i.DatePost = moment(i.DatePost, "YYYY-MM-DD HH:mm").format(
          "DD/MM/YYYY HH:mm"
        );
      }
      for(var i of top10PostByView){
        i.DatePost = moment(i.DatePost, "YYYY-MM-DD HH:mm").format(
          "DD/MM/YYYY HH:mm"
        );
      }
      for(var i of newestPost){
        i.DatePost = moment(i.DatePost, "YYYY-MM-DD HH:mm").format(
          "DD/MM/YYYY HH:mm"
        );
        
      }

      var matrixTop10View = [];
      var index = 0;
      var listTemp = [];
      for(var i = 2, counter = 1; i < top10PostByView.length; i++, counter++){
        listTemp.push(top10PostByView[i]);
        if(counter === 3) {
          var entity = {child:[]};
          matrixTop10View.push(entity);
          matrixTop10View[index].child = listTemp;
          index++; counter = 0;
          listTemp = [];
        }
      }
      
      var matrixNewest = [];
      listTemp=[];index = 0;
      for(var i = 0; i < newestPost.length; i++){
        listTemp.push(newestPost[i]);
        if((i + 1) % 5 === 0) {
          var entity = {child:[]};
          matrixNewest.push(entity);
          matrixNewest[index].child = listTemp;
          index++;
          listTemp = [];
        }
      }
      if(matrixNewest.length > 0){
        matrixNewest[0].active ="active";
      }
      if(newestPost.length > 0){
        newestPost[0].active="active";
      }
      if(matrixTop10View.length > 0){
        matrixTop10View[0].active = "active";
      }
      if(impressPost.length > 0){
        impressPost[0].active = "active";
      }

      
      res.render("index", {
        ListNewsPost,
        impressPost,
        top10PostByView,
        matrixTop10View,
        matrixNewest,
        newestPost
      });
    })
    .catch(next);
});

router.post('/ajax-get-posts', (req, res, next) =>{
  const OFFSET = +req.body.Page * 10;

  Promise.all([post_model.getNewPosts(OFFSET), tag_model.getAll()])
    .then(([ListNewsPost, ListTag]) => {
      ListNewsPost.forEach(element => {
        //Fomat DateTime
        element.DatePost = moment(element.DatePost, "YYYY-MM-DD HH:mm").format(
          "DD/MM/YYYY HH:mm"
        );

        //Lay Du Lieu Tag
        element.ListTag = [];
        element.ListTagID = element.ListTagID.split(",");
        element.ListTagID.forEach(x => {
          var ObjectTag = {};
          ListTag.forEach(y => {
            if (y.TagID === +x) {
              ObjectTag.ID = y.TagID;
              ObjectTag.Name = y.Name
              return;
            }
          });
          element.ListTag.push(ObjectTag);
        });
      });
      res.send(ListNewsPost);
    })
    .catch(next);
  
});



module.exports = router;
