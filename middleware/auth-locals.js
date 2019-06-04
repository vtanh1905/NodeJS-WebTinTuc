var moment = require("moment");

module.exports = (req, res, next) => {
  if (req.user) {
    res.locals.isAuthenticated = true;
    res.locals.authUser = req.user;
    res.locals.authUser.DOBFormat = moment(res.locals.authUser.DOB, "YYYY-MM-DD").format("DD/MM/YYYY");
    res.locals.authUser.isPremium = moment(res.locals.authUser.DatePremium, "YYYY-MM-DD").diff(moment()) > 0 ? true : false;
  }
  next();
}