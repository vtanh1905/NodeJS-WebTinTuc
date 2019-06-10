var express = require("express");
var post_model = require("../models/post.model");
var tag_model = require("../models/tag.model");
var moment = require("moment");

var router = express.Router();

router.get("/", (req, res, next) => {
  // 10 Bài Viết Mới Nhất Mọi Chuyên Mục
  Promise.all([post_model.getNewPosts(0), tag_model.getAll()])
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

      res.render("index", {
        ListNewsPost
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
