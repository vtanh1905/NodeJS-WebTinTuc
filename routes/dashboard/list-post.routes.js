var express = require("express");
var tag_model = require("../../models/tag.model");
var post_model = require("../../models/post.model");
var moment = require("moment");
var router = express.Router();

// ==================================================================================================================================================================================================================
// Bai Viết - START

//Danh Sach Bài Viết
router.get("/list-post", (req, res, next) => {
  var id = res.locals.authUser.AccID;
  var page = req.query.page || 1;
  var status = req.query.Status || 4;
  var search = req.query.Search || "";
  var limit = req.query.Limit || 10;
  var offset = (page - 1) * limit;
  if(isNaN(limit) || isNaN(page) || isNaN(status)){
    res.redirect('/dashboard/approve');
    return;
}

  Promise.all([post_model.allById(status, search, offset, limit,id), post_model.CountallById(status, search,id)]).then(([rows, count_rows]) => {
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
     

      res.render('dashboard/list-post/index', {
          rows, pages, pageNext, pagePre, search, status, limit,
          helpers: {
              ifEquals: function (arg1, arg2, options) {
                  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
              }
          }
      });

  }).catch(next);
  //res.render("dashboard/list-post/index", {});
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
  var listTagIsExist= [];
  tag_model
    .getAll()
    .then(listTag => {
      ListTagName.forEach(x => {
        var Exist = false;
        listTag.forEach(y => {
          if (x === y.Name) {
            Exist = true;
            listTagIsExist.push(y.TagID);
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
          for (var i = resultMutiAdd.insertId; i < resultMutiAdd.insertId + listTagMustAdd.length; ++i) {
            req.body.ListTagID.push(i);
          }
          req.body.ListTagID = req.body.ListTagID.concat(listTagIsExist);
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
        req.body.ListTagID = listTagIsExist.toString();
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
router.get("/list-post/:id/edit", (req, res, next) => {
  const PostID = req.params.id;
  if (isNaN(PostID)) {
    next();
    return;
  }

  Promise.all([post_model.single(PostID, res.locals.authUser.AccID), tag_model.getAll()])
    .then(([DataPost, ListTag]) =>{
      if (DataPost.length === 0) {
        next();
        return;
      }

      var ListTagName = [];
      var arrTag = DataPost[0].ListTagID.split(",");
      arrTag.forEach(x => {
        ListTag.forEach(y => {
          if(y.TagID === +x){
            ListTagName.push(y.Name);
            return;
          }
        });
      });
      
      res.render("dashboard/list-post/edit", {
        DataPost : DataPost[0],
        ListTagName
      });
    }).catch(next);
});

router.post("/list-post/:id/edit", (req, res, next) => {
  const ID = req.params.id;
  if (isNaN(ID)) {
    next();
    return;
  }

  //Xư lý thêm Tag
  var ListTagName = [];
  if (Array.isArray(req.body.ListTagName)) {
    ListTagName = req.body.ListTagName;
  } else {
    if (req.body.ListTagName) {
      ListTagName.push(req.body.ListTagName);
    }
  }
  var listTagIsExist= [];
  var listTagMustAdd = [];
  tag_model
    .getAll()
    .then(listTag => {
      ListTagName.forEach(x => {
        var Exist = false;
        listTag.forEach(y => {
          if (x === y.Name) {
            Exist = true;
            listTagIsExist.push(y.TagID);
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
          for (var i = resultMutiAdd.insertId; i < resultMutiAdd.insertId + listTagMustAdd.length; ++i) {
            req.body.ListTagID.push(i);
          }
          req.body.ListTagID = req.body.ListTagID.concat(listTagIsExist);
          req.body.ListTagID = req.body.ListTagID.toString();

          //Them Post
          if (req.files) {
            //Th Có File Ảnh
            if (Object.keys(req.files).length == 0) {
              return res.status(400).send("No files were uploaded.");
            }
            let sampleFile = req.files.sampleFile;
            var url = `/images/posts/${req.body.PostID}` + sampleFile.name.match(/\.[0-9a-z]+$/i);
            sampleFile.mv("./public" + url, function (err) {
              if (err) return res.status(500).send(err);

              req.body.URLImage = url;

              post_model.update(req.body.PostID, req.body).then(resultUpdatePost => {
                res.redirect('/dashboard/list-post');
              }).catch(next);
            });
          } else {
            //Th Không Có File Ảnh
            post_model.update(req.body.PostID, req.body).then(resultUpdatePost => {
              res.redirect('/dashboard/list-post');
            }).catch(next);
          }

        }).catch(next);
      } else {
        req.body.ListTagID = listTagIsExist.toString();
        //Th Khong co Tag
        if (req.files) {
          //Th Có File Ảnh
          if (Object.keys(req.files).length == 0) {
            return res.status(400).send("No files were uploaded.");
          }
          let sampleFile = req.files.sampleFile;
          var url = `/images/posts/${req.body.PostID}` + sampleFile.name.match(/\.[0-9a-z]+$/i);
          sampleFile.mv("./public" + url, function (err) {
            if (err) return res.status(500).send(err);

            req.body.URLImage = url;

            post_model.update(req.body.PostID, req.body).then(resultUpdatePost => {
              res.redirect('/dashboard/list-post');
            }).catch(next);
          });
        } else {
          //Th Không Có File Ảnh
          post_model.update(req.body.PostID, req.body).then(resultUpdatePost => {
            res.redirect('/dashboard/list-post');
          }).catch(next);
        }
      }
    })
    .catch(next);
});

// Bai Viết - END
// ==================================================================================================================================================================================================================

module.exports = router;