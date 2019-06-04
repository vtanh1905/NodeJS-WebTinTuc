var express = require("express");
var account_model = require("../models/account.model");
const bcrypt = require("bcrypt");
var moment = require("moment");
var passport = require("passport");
var auth = require('../middleware/auth');

var router = express.Router();

router.get("/login", auth.login,(req, res, next) => {
  res.render("login", {});
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render("login", {
        error_message: info.message
      });
    }

    req.logIn(user, err => {
      if (err) return next(err);

      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

router.post("/check-user", (req, res, next) => {
  const Username = req.body.Username;
  if (/\s/g.test(Username)) {
    res.json(false);
    return;
  }
  account_model
    .singleByUsername(req.body.Username)
    .then(result => {
      if (result.length > 0) {
        res.json(false);
        return;
      }
      res.json(true);
    })
    .catch(next);
});

router.post("/logout",(req, res, next) => {
  req.logOut();
  res.redirect('/login');
});

router.post("/login/createAccount", (req, res, next) => {
  //Delete Confirm
  delete req.body.Confirm;

  //Add Status vs Type
  req.body.Status = 1;
  req.body.Type = 0;

  //Hash Password
  req.body.Password = bcrypt.hashSync(
    req.body.Password,
    bcrypt.genSaltSync(10)
  );

  // Format DOB
  req.body.DOB = moment(req.body.DOB, "DD/MM/YYYY").format("YYYY-MM-DD");

  console.log("====================================");
  console.log(req.body);
  console.log("====================================");

  account_model
    .add(req.body)
    .then(result => {
      res.redirect("/login");
    })
    .catch(next);
});

module.exports = router;
