var express = require("express");
var tag_model = require("../../models/tag.model");
var post_model = require("../../models/post.model");
var router = express.Router();

// ==================================================================================================================================================================================================================
// Bai Viết - START

//Danh Sach Bài Viết
router.get("/list-post", (req, res, next) => {
  res.render("dashboard/list-post/index", {});
});

//Thêm Bài Viết Mới
router.get("/list-post/add", (req, res, next) => {
  res.render("dashboard/list-post/add", {});
});

router.post("/list-post/add", (req, res, next) => {
  //Xư lý thêm Tag
  var ListTagName = [];
  if (Array.isArray(req.body.ListTagName)) {
    ListTagName = req.body.ListTagName;
  } else {
    if (req.body.ListTagName) {
      ListTagName.push(req.body.ListTagName);
    }
  }
  var listTagMustAdd = [];
  tag_model
    .getAll()
    .then(listTag => {
      ListTagName.forEach(x => {
        var Exist = false;
        listTag.forEach(y => {
          if (x === y.Name) {
            Exist = true;
            return;
          }
        });
        if (Exist === false) {
          listTagMustAdd.push(x);
        }
      });

      //Format isPremium
      if (req.body.isPremium === "on") {
        req.body.isPremium = 1;
      } else {
        req.body.isPremium = 0;
      }

      delete req.body.sampleFile;
      delete req.body.ListTagName;
      req.body.Status = 1;
      req.body.Approve = 1;
      req.body.View = 0;
      req.body.AccID = res.locals.authUser.AccID;
      

      if (listTagMustAdd.length > 0) {
        tag_model.mutiAdd(listTagMustAdd).then(resultMutiAdd => {
          //Xu lý conver ID Tag To String
          req.body.ListTagID = [];
          for (var i = resultMutiAdd.insertId; i <= resultMutiAdd.insertId + listTagMustAdd.length; ++i) {
            req.body.ListTagID.push(i);
          }
          req.body.ListTagID = req.body.ListTagID.toString();

          //Them Post
          if (req.files) {
            post_model.nextID().then(nextID =>{
              //Th Có File Ảnh
              if (Object.keys(req.files).length == 0) {
                return res.status(400).send("No files were uploaded.");
              }
              let sampleFile = req.files.sampleFile;
              var url = `/images/posts/${nextID[0].AUTO_INCREMENT}` + sampleFile.name.match(/\.[0-9a-z]+$/i);
              sampleFile.mv("./public" + url, function (err) {
                if (err) return res.status(500).send(err);
  
                req.body.URLImage = url;
  
                post_model.add(req.body).then(resultAddPost => {
                  res.redirect('/dashboard/list-post');
                }).catch(next);
              });
            }).catch(next);
          } else {
            //Th Không Có File Ảnh
            post_model.add(req.body).then(resultAddPost => {
              res.redirect('/dashboard/list-post');
            }).catch(next);
          }

        }).catch(next);
      } else {
        //Th Khong co Tag
        if (req.files) {
          post_model.nextID().then(nextID =>{
            //Th Có File Ảnh
            if (Object.keys(req.files).length == 0) {
              return res.status(400).send("No files were uploaded.");
            }
            let sampleFile = req.files.sampleFile;
            var url = `/images/posts/${nextID[0].AUTO_INCREMENT}` + sampleFile.name.match(/\.[0-9a-z]+$/i);
            sampleFile.mv("./public" + url, function (err) {
              if (err) return res.status(500).send(err);

              req.body.URLImage = url;

              post_model.add(req.body).then(resultAddPost => {
                res.redirect('/dashboard/list-post');
              }).catch(next);
            });
          }).catch(next);
        } else {
          //Th Không Có File Ảnh
          post_model.add(req.body).then(resultAddPost => {
            res.redirect('/dashboard/list-post');
          }).catch(next);
        }
      }
    })
    .catch(next);
});

//Sữa Bài Viết Mới
router.get("/list-post/edit", (req, res, next) => {
  res.render("dashboard/list-post/edit", {});
});

// Bai Viết - END
// ==================================================================================================================================================================================================================

module.exports = router;