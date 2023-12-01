var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./src/routes/index");
var usersRouter = require("./src/routes/users.routes");
var rolesRouter = require("./src/routes/roles.routes");
var accountRouter = require("./src/routes/accounts.routes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/accounts", accountRouter);

// Sync models
let models = require("./src/models");

models.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Se han sincronizado los modelos");
  })
  .catch((error) => {
    console.log("Ha habido un error", error);
  });
// Sync models finish

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.json(res.locals.error);
  res.render("error");
});

module.exports = app;
