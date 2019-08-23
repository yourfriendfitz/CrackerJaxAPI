const express = require("express");
const path = require("path");
const models = require("./models");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  TOOLS TO ADD DATA --------------------------------

app.post("/user", async (req, res, next) => {
  const username = req.body.username;
  const user = models.User.build({
    username
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
  const imageUrl = req.body.imageUrl;
  const vendor = models.Vendor.build({
    name,
    imageUrl
  });
  try {
    const response = await vendor.save();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post("/order", async (req, res, next) => {
  const products = req.body.productIds;
  const uid = req.body.uid;
  const ready = false;
  const paid = true;
  const order = models.Order.build({
    uid,
    ready,
    paid
  });
  try {
    const responseArray = [];
    const response = await order.save();
    const orderId = response.id;

    products.forEach(product => {
      const productId = parseInt(product);
      const orderItem = models.OrderItem.build({
        orderId,
        productId
      });
      const response = orderItem.save();
      responseArray.push(response);
    });
    res.json(responseArray);
  } catch (error) {
    res.json(error);
  }
});

app.post("/orderByEmail", async (req, res, next) => {
  const username = req.params.email;
  const uidObj = await models.User.findOne({
    attributes: ["id"],
    where: {
      username
    }
  });
  const uid = uidObj.dataValues.id;
  const products = req.body.productIds;
  const ready = false;
  const paid = true;
  const order = models.Order.build({
    uid,
    ready,
    paid
  });
  try {
    const responseArray = [];
    const response = await order.save();
    const orderId = response.id;

    products.forEach(product => {
      const productId = parseInt(product);
      const orderItem = models.OrderItem.build({
        orderId,
        productId
      });
      const response = orderItem.save();
      responseArray.push(response);
    });
    res.json(responseArray);
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

// API ROUTES --------------------------------------------

app.get("/api/orders", async (req, res) => {
  const orders = await models.OrderItem.findAll();
  res.json(orders);
});

app.get("/api/orders/:id", async (req, res) => {
  const products = await models.Product.findAll({
    where: {
      id: await models.OrderItem.findAll({
        attributes: ["productId"],
        where: {
          orderId: req.params.id
        }
      }).map(obj => obj.dataValues.productId)
    }
  });
  const order = await models.Order.findOne({
    where: {
      id: req.params.id
    }
  });
  res.json({
    order,
    products
  });
});

app.get("/api/products", async (req, res) => {
  const products = await models.Product.findAll();
  res.json(products);
});

app.get("/api/products/:vendorId", async (req, res) => {
  const products = await models.Product.findAll({
    where: {
      vendorId: req.params.vendorId
    }
  });
  res.json(products);
});

app.get("/api/users", async (req, res) => {
  const users = await models.User.findAll();
  res.json(users);
});

app.get("/api/vendors", async (req, res) => {
  const vendors = await models.Vendor.findAll();
  res.json(vendors);
});

app.get("/api/users/:id/orders", async (req, res) => {
  const orders = await models.Order.findAll({
    include: [
      {
        model: models.OrderItem,
        as: "items"
      }
    ],
    where: {
      uid: req.params.id
    }
  });
  for (const order of orders) {
    const orderItems = order.items;
    for (const item of orderItems) {
      const id = item.dataValues.productId;
      item.dataValues.product = await models.Product.findOne({
        where: {
          id
        }
      });
    }
  }
  res.json(orders);
});

app.get("/api/:email/orders", async (req, res) => {
  const username = req.params.email;
  const uidObj = await models.User.findOne({
    attributes: ["id"],
    where: {
      username
    }
  });
  const uid = uidObj.dataValues.id;
  const orders = await models.Order.findAll({
    include: [
      {
        model: models.OrderItem,
        as: "items"
      }
    ],
    where: {
      uid
    }
  });
  for (const order of orders) {
    const orderItems = order.items;
    for (const item of orderItems) {
      const id = item.dataValues.productId;
      item.dataValues.product = await models.Product.findOne({
        where: {
          id
        }
      });
    }
  }
  res.json(orders);
});

app.get("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await models.User.findOne({
    where: {
      id
    }
  });
  res.json(user);
});

app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const product = await models.Product.findOne({
    where: {
      id
    }
  });
  res.json(product);
});

app.get("/api/products/type/:type", async (req, res) => {
  const type = req.params.type;
  const product = await models.Product.findAll({
    where: {
      type
    }
  });
  res.json(product);
});

app.get("/api/vendors/:id", async (req, res) => {
  const id = req.params.id;
  const vendor = await models.Vendor.findOne({
    where: {
      id
    }
  });
  res.json(vendor);
});

app.get("/api/vendors/:id/orders", async (req, res) => {
  const vendorId = req.params.id;
  const orderIds = await models.OrderItem.findAll({
    where: {
      productId: await models.Product.findAll({
        where: {
          vendorId
        }
      }).map(obj => obj.dataValues.id)
    }
  }).map(obj => obj.dataValues.orderId);
  const orders = await models.Order.findAll({
    include: [
      {
        model: models.OrderItem,
        as: "items"
      }
    ],
    where: {
      id: orderIds
    }
  });
  for (const order of orders) {
    const orderItems = order.items;
    for (const item of orderItems) {
      const id = item.dataValues.productId;
      item.dataValues.product = await models.Product.findOne({
        where: {
          id
        }
      });
    }
  }
  res.json(orders);
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
