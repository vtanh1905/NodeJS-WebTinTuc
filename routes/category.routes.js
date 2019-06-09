var express = require("express");

var router = express.Router();

router.get("/category/:id", (req, res, next) => {
  const ID = req.params.id;

  if (isNaN(ID)) {
    next();
    return;
  }
  res.render("category", {});
});

module.exports = router;
