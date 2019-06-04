module.exports = {
  login: (req, res, next) => {
    if (req.user) {
      res.redirect("/dashboard");
    } else {
      next();
    }
  }, 
  user: (req, res, next) => {
    if (!req.user) {
      res.redirect("/login");
    } else {
      next();
    }
  },
  list_post: (req, res, next) => {
    if (!req.user) {
      res.redirect("/login");
    } else {
      if (req.user.Type == 1 || req.user.Type == 3) {
        next();
      } else {
        res.redirect("/dashboard");
      }
    }
  },
  approve: (req, res, next) => { 
    if (!req.user) {
      res.redirect("/login");
    } else {
      if (req.user.Type == 2) {
        next();
      } else {
        res.redirect("/dashboard");
      }
    }
  },
  manage: (req, res, next) => {
    if (!req.user) {
      res.redirect("/login");
    } else {
      if (req.user.Type == 3) {
        next();
      } else {
        res.redirect("/dashboard");
      }
    }
  }
};
