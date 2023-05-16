const express = require("express");
const {
  newOrderController,
  getSingleOrderController,
  getmyOrdersController,
  getAllOrdersController,
  updateOrderController,
  deleteOrderController,
} = require("../controllers/orderController");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { authorizeRoles } = require("../middlewares/authorizeRoles.middleware");
const orderRouter = express.Router();

orderRouter.post("/new", authenticate, newOrderController);
orderRouter.get("/order/:id", authenticate, getSingleOrderController);
orderRouter.get("/myorders", authenticate, getmyOrdersController);

// ADMIN
orderRouter.get(
  "/admin/allorders",
  authenticate,
  authorizeRoles("admin"),
  getAllOrdersController
);
orderRouter.put(
  "/admin/order/update/:id",
  authenticate,
  authorizeRoles("admin"),
  updateOrderController
);
orderRouter.delete(
  "/admin/order/delete/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteOrderController
);

module.exports = { orderRouter };
