var express = require("express");
var moment = require("moment");
const bcrypt = require("bcrypt");
var account_model = require("../../models/account.model");

var router = express.Router();

// ==================================================================================================================================================================================================================
//Thông Tin Người dung
router.get("/", (req, res, next) => {
  res.render("dashboard/index", {});
});
// ==================================================================================================================================================================================================================

//Thông Tin Người dung
router.post("/change-info", (req, res, next) => {
  req.body.DOB = moment(req.body.DOB, "DD/MM/YYYY").format("YYYY-MM-DD");
  account_model
    .update(res.locals.authUser.AccID, req.body)
    .then(result => {
      res.locals.authUser.FullName = req.body.FullName;
      res.locals.authUser.Email = req.body.Email;
      res.locals.authUser.DOB = req.body.DOB;
      res.locals.authUser.NickName = req.body.NickName;
      res.redirect("/dashboard");
    })
    .catch(next);
});

router.post("/change-pass", (req, res, next) => {
  //Hash Password
  req.body.Password = bcrypt.hashSync(
    req.body.Password,
    bcrypt.genSaltSync(10)
  );
  account_model
    .update(res.locals.authUser.AccID, req.body)
    .then(result => {
      res.redirect("/dashboard");
    })
    .catch(next);
});

router.post("/change-avatar", (req, res, next) => {
  if (req.files) {
    //Th Có File Ảnh
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send("No files were uploaded.");
    }
    let sampleFile = req.files.sampleFile;
    var url = `/images/users/${res.locals.authUser.AccID}` + sampleFile.name.match(/\.[0-9a-z]+$/i);
    sampleFile.mv("./public" + url, function(err) {
      if (err) return res.status(500).send(err);
      req.body.Avatar = url;
      res.locals.authUser.Avatar = url;
      account_model
        .update(res.locals.authUser.AccID, req.body)
        .then(result => {
          res.redirect("/dashboard");
        })
        .catch(next);
    });
  } else {
    res.redirect("/dashboard");
  }
});

module.exports = router;
