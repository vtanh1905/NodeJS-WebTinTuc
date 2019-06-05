var express = require("express");
var moment = require("moment");
const bcrypt = require("bcrypt");
var account_model = require("../../models/account.model");
var category_model = require("../../models/category.model");

var router = express.Router();

// ==================================================================================================================================================================================================================
// Quản Lý User
router.get("/user", (req, res, next) => {
  const TYPE = req.query.type || -1;
  const SEARCH = req.query.search || "";
  const LIMITPAGE = req.query.pageShow || 10;
  const PAGECURRNT = req.query.page || 1;
  const OFFSET = (PAGECURRNT - 1) * LIMITPAGE;

  Promise.all([
    account_model.allWithPostsFSP(TYPE, SEARCH, LIMITPAGE, OFFSET),
    account_model.countAll(TYPE, SEARCH)
  ])
    .then(([result, countAcc]) => {
      result.forEach(element => {
        //Them Vai Tro Cac Element
        switch (element.Type) {
          case 0:
            element.Role = "Độc Giả";
            break;
          case 1:
            element.Role = "Phóng Viên";
            break;
          case 2:
            element.Role = "Biên Tập Viên";
            break;
          case 3:
            element.Role = "Quản Trị Viên";
            break;
          default:
            break;
        }
      });
      // //Phan Trang
      const TOTALPAGE = Math.ceil(countAcc[0].TotalAccount / LIMITPAGE);
      const SPACE = 6;
      var Paging = {
        Pages : [],
        PageCurrent : PAGECURRNT,
        nextPage : (PAGECURRNT + 1) - TOTALPAGE < 0 ? (PAGECURRNT + 1) : false,
        prePage : (PAGECURRNT - 1) > 0 ? (PAGECURRNT - 1) : false
      }
      var i;
      if(PAGECURRNT - (SPACE - 2) <= 0){
        i = 1
      }else if((PAGECURRNT  > (TOTALPAGE  - 3))){
        i = TOTALPAGE - SPACE;
      }else {
        i = PAGECURRNT - 3;
      }

      Paging.Pages.push(i);
      for(var count = 0; count < SPACE; ++count){
        ++i;
        if(i > TOTALPAGE){
          break;
        }
        Paging.Pages.push(i);
      }

      res.render("dashboard/manage/user/index", {
        dataUser: result,
        TypeSelected: TYPE,
        TotalPageSelected: LIMITPAGE,
        TextSearch: SEARCH,
        Paging : Paging
      });
    })
    .catch(next);
});

//Add
router.get("/user/add", (req, res, next) => {
  category_model
    .all()
    .then(result => {
      res.render("dashboard/manage/user/add", {
        dataCat: result
      });
    })
    .catch(next);
});

router.post("/user/add", (req, res, next) => {
  //Them Status
  req.body.Status = true;
  //Fomat Date
  req.body.DOB = moment(req.body.DOB, "DD/MM/YYYY").format("YYYY-MM-DD");
  req.body.DatePremium = moment(
    req.body.DatePremium,
    "DD/MM/YYYYTHH:mm"
  ).format("YYYY-MM-DD HH:mm");

  //Hash Password
  req.body.Password = bcrypt.hashSync(
    req.body.Password,
    bcrypt.genSaltSync(10)
  );

  //Fomat ManageCatID
  if (req.body.ManageCatID) {
    req.body.ManageCatID = req.body.ManageCatID.toString();
  }

  account_model
    .nextID()
    .then(result => {
      var nextID = result[0].AUTO_INCREMENT;
      //Upload Image
      if (req.files) {
        //Th Có File Ảnh
        if (Object.keys(req.files).length == 0) {
          return res.status(400).send("No files were uploaded.");
        }
        let sampleFile = req.files.sampleFile;
        var url =
          `/images/users/${nextID}` + sampleFile.name.match(/\.[0-9a-z]+$/i);
        sampleFile.mv("./public" + url, function(err) {
          if (err) return res.status(500).send(err);

          req.body.Avatar = url;
          account_model
            .add(req.body)
            .then(result => {
              res.redirect("/dashboard/user");
            })
            .catch(next);
        });
      } else {
        //Th Không Có File Ảnh
        account_model
          .add(req.body)
          .then(result => {
            res.redirect("/dashboard/user");
          })
          .catch(next);
      }
    })
    .catch(next);
});

//Edit
router.get("/user/:id/edit", (req, res, next) => {
  const ID = req.params.id;
  if (isNaN(ID)) {
    next();
    return;
  }

  Promise.all([account_model.single(ID), category_model.all()])
    .then(([result, catData]) => {
      if (result.length === 0) {
        next();
        return;
      }

      result[0].DOBFormat = moment(result[0].DOB, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      result[0].DatePremiumFormat = moment(
        result[0].DatePremium,
        "YYYY-MM-DD HH:mm"
      ).format("DD/MM/YYYYTHH:mm");

      res.render("dashboard/manage/user/edit", {
        dataUser: result[0],
        dataCat: catData
      });
    })
    .catch(next);
});

router.post("/user/:id/edit", (req, res, next) => {
  const ID = req.params.id;

  //Fomat Date
  req.body.DOB = moment(req.body.DOB, "DD/MM/YYYY").format("YYYY-MM-DD");
  req.body.DatePremium = moment(
    req.body.DatePremium,
    "DD/MM/YYYYTHH:mm"
  ).format("YYYY-MM-DD HH:mm");

  //Hash Password
  if (req.body.Password != "DontChangePassword") {
    req.body.Password = bcrypt.hashSync(
      req.body.Password,
      bcrypt.genSaltSync(10)
    );
  } else {
    delete req.body.Password;
  }

  //Fomat ManageCatID
  if (req.body.ManageCatID) {
    req.body.ManageCatID = req.body.ManageCatID.toString();
  }

  if (req.files) {
    //Th Có File Ảnh
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send("No files were uploaded.");
    }
    let sampleFile = req.files.sampleFile;
    var url = `/images/users/${ID}` + sampleFile.name.match(/\.[0-9a-z]+$/i);
    sampleFile.mv("./public" + url, function(err) {
      if (err) return res.status(500).send(err);

      req.body.Avatar = url;
      account_model
        .update(ID, req.body)
        .then(result => {
          res.redirect("/dashboard/user");
        })
        .catch(next);
    });
  } else {
    account_model
      .update(ID, req.body)
      .then(result => {
        res.redirect("/dashboard/user");
      })
      .catch(next);
  }
});

//Delete
router.post("/user/:id/delete", (req, res, next) => {
  account_model
    .delete(req.params.id)
    .then(result => {
      res.redirect("/dashboard/user");
    })
    .catch(next);
});
// ==================================================================================================================================================================================================================

module.exports = router;
