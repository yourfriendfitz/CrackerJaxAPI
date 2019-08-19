const express = require("express");
const path = require("path");
const models = require("./models");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/user", async (req, res, next) => {
  const username = req.body.name;
  const password = req.body.password;
  const user = models.User.build({
    username: username,
    password: password
  });
  try {
    const response = await user.save();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post("/vendor", async (req, res, next) => {
  const name = req.body.name;
  const vendor = models.Vendor.build({
    name
  });
  try {
    const response = await vendor.save();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post("/product", async (req, res, next) => {
  const name = req.body.name;
  const price = parseInt(req.body.price);
  const ageRestricted = req.body.ageRestricted === "true" ? true : false;
  const vendorId = parseInt(req.body.vendorId);
  const type = req.body.type;
  const imageUrl = req.body.imageUrl;
  const product = models.Product.build({
    name,
    price,
    ageRestricted,
    vendorId,
    type,
    imageUrl
  });
  try {
    const response = await product.save();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
