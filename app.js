// Import Module
var express = require("express");
var exphbs = require("express-handlebars");
var morgan = require("morgan");
var createError = require("http-errors");
var express_handlebars_sections = require("express-handlebars-sections");
const fileUpload = require("express-fileupload");
var numeral = require('numeral');
//Setting Express
var app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(fileUpload());

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/_layouts/",
    partialsDir: __dirname + "/views/components/",
    helpers: {
      section: express_handlebars_sections(),
      ifEquals: (arg1, arg2, options) => {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
      ifDifferent: (arg1, arg2, options) => {
        return arg1 != arg2 ? options.fn(this) : options.inverse(this);
      },
      format: val => {
        return numeral(val).format("0,0") + "  VND";
      }
    }
  })
);
app.set("view engine", "hbs");

//MiddleWare
require("./middleware/session")(app);
require("./middleware/passport")(app);
app.use(require("./middleware/auth-locals"));
app.use(require("./middleware/nav.mdw"));

//Router
require("./middleware/router")(app);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    layout: false
  });
});

app.listen(3000);
