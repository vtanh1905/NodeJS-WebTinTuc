var express = require("express");
var postdb = require("../../models/post.model");
var tagdb = require("../../models/tag.model");
var router = express.Router();
var moment = require("moment");
// ==================================================================================================================================================================================================================
// Phê duyệt - START
var ConverArr = a => {
  var Temp = [];
  for (var i = 0; i < a.length; i++) {
    if (a.charAt(i) != ",") {
      Temp.push(a.charAt(i));
    }
  }
  return Temp;
};

router.get("/approve", (req, res, next) => {
  var account = res.locals.authUser;
  var ComId = account.ManageCatID;
  var page = req.query.page || 1;
  var status = req.query.Status || -1;
  var search = req.query.Search || "";
  var limit = req.query.Limit || 10;
  var offset = (page - 1) * limit;
  if (ComId == null) {
    Check_QuanLi = false;
    res.render("dashboard/approve", {
      Check_QuanLi,
      search,
      status,
      limit,
      helpers: {
        ifEquals: function(arg1, arg2, options) {
          return arg1 == arg2 ? options.fn(this) : options.inverse(this);
        }
      }
    });

    return;
  }
  var Cat = ConverArr(ComId);

  if (isNaN(limit) || isNaN(page) || isNaN(status)) {
    res.redirect("/dashboard/approve");
    return;
  }

  postdb
    .AllCatInArr(Cat)
    .then(rows => {
      var Check_QuanLi = true;
      //Danh sach thu muc hien thi
      var CatShow = [];
      //Danh sach ID de lay post
      var CatID = [];

      // khong quan li bat ki thu muc nao
      if (rows.length == 0) {
        Check_QuanLi = false;
        res.render("dashboard/approve", {
          Check_QuanLi,
          rows,
          search,
          status,
          limit,
          helpers: {
            ifEquals: function(arg1, arg2, options) {
              return arg1 == arg2 ? options.fn(this) : options.inverse(this);
            }
          }
        });
        return;
      }
      //Lay ten cac thu muc
      rows.forEach(element => {
        var ele = {
          name: element.Name,
          Id: element.CatID
        };
        CatShow.push(ele);
      });
      if (status == -1) {
        CatID = Cat;
      } else {
        CatID.push(status);
      }
      console.log(CatShow);
      Promise.all([
        postdb.AllByCatID(search, offset, limit, CatID),
        postdb.CountAllByCatID(search, CatID)
      ])
        .then(([rows, rows_count]) => {
          if (rows.length == 0) {
            Check_QuanLi = false;
            res.render("dashboard/approve", {
              Check_QuanLi,
              rows,
              search,
              status,
              limit,
              helpers: {
                ifEquals: function(arg1, arg2, options) {
                  return arg1 == arg2
                    ? options.fn(this)
                    : options.inverse(this);
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
          rows.forEach(element => {
            element.DatePost = moment(
              element.DatePost,
              "YYYY-MM-DD HH:MM"
            ).format("DD/MM/YYYY HH:MM");
            var cmt = element.ListComID;
            if (cmt == null) {
              element.count = 0;
            } else {
              if (cmt.length == 0) {
                element.count = 0;
              } else {
                element.count = cmt.split(",").length;
              }
            }
          });
          Check_QuanLi = true;
          res.render("dashboard/approve", {
            rows,
            CatShow,
            pages,
            pageNext,
            pagePre,
            search,
            status,
            limit,
            Check_QuanLi,
            helpers: {
              ifEquals: function(arg1, arg2, options) {
                return arg1 == arg2 ? options.fn(this) : options.inverse(this);
              }
            }
          });
        })
        .catch(next);
    })
    .catch(next);
});

router.get("/approve/:id/edit", (req, res, next) => {
  const PostID = req.params.id;
  if (isNaN(PostID)) {
    next();
    return;
  }

  Promise.all([postdb.singleWithPostID(PostID), tagdb.getAll()])
    .then(([DataPost, ListTag]) => {
      if (DataPost.length === 0) {
        next();
        return;
      }

      var ListTagName = [];
      var arrTag = DataPost[0].ListTagID.split(",");
      arrTag.forEach(x => {
        ListTag.forEach(y => {
          if (y.TagID === +x) {
            ListTagName.push(y.Name);
            return;
          }
        });
      });
      res.render("dashboard/approve/edit", {
        DataPost: DataPost[0],
        ListTagName
      });
    })
    .catch(next);
});

router.post("/approve/:id/edit", (req, res, next) => {
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
  var listTagIsExist = [];
  var listTagMustAdd = [];
  tagdb
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

      //req.body.Approve = 1;
      if (+req.body.Approve == 0) {
        delete req.body.DatePost;
      } else {
        req.body.Reason = "";
        if (req.body.typeOfDangBai == "now") {
          req.body.DatePost = moment().format("YYYY-MM-DD HH:mm");
        } else {
          req.body.DatePost = moment(
            req.body.DatePost,
            "DD/MM/YYYY HH:mm"
          ).format("YYYY-MM-DD HH:mm");
        }
      }
      delete req.body.Content;
      delete req.body.Title;
      delete req.body.Abstract;
      delete req.body.typeOfDangBai;
      delete req.body.ListTagName;

      req.body.Status = 1;
      req.body.View = 0;
      //req.body.AccID = res.locals.authUser.AccID;

      if (listTagMustAdd.length > 0) {
        tagdb
          .mutiAdd(listTagMustAdd)
          .then(resultMutiAdd => {
            //Xu lý conver ID Tag To String
            req.body.ListTagID = [];
            for (
              var i = resultMutiAdd.insertId;
              i < resultMutiAdd.insertId + listTagMustAdd.length;
              ++i
            ) {
              req.body.ListTagID.push(i);
            }
            req.body.ListTagID = req.body.ListTagID.concat(listTagIsExist);
            req.body.ListTagID = req.body.ListTagID.toString();

            //Th Không Có File Ảnh
            postdb
              .update(req.body.PostID, req.body)
              .then(resultUpdatePost => {
                res.redirect("/dashboard/approve");
              })
              .catch(next);
          })
          .catch(next);
      } else {
        req.body.ListTagID = listTagIsExist.toString();
        postdb
          .update(req.body.PostID, req.body)
          .then(resultUpdatePost => {
            res.redirect("/dashboard/approve");
          })
          .catch(next);
      }
    })
    .catch(next);
});

// Phê duyệt - END
// ==================================================================================================================================================================================================================

module.exports = router;
