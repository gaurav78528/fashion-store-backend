const express = require("express");
const {
  getProductsController,
  getSingleProductController,
  addNewProductController,
  deleteProductController,
  updateProductController,
  productReviewController,
  getProductReviewController,
  getAdminProductsController,
  deleteReviewController,
  getProductReviewsController,
} = require("../controllers/products.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { authorizeRoles } = require("../middlewares/authorizeRoles.middleware");

const productsRouter = express.Router();

// Products Route
// productsRouter.use(authenticate);

// productsRouter.use(authenticate);

productsRouter.get("/", getProductsController);

productsRouter.get("/:_id", getSingleProductController);

productsRouter.post(
  "/admin/add",
  authenticate,
  authorizeRoles("admin"),
  addNewProductController
);
productsRouter.patch(
  "/admin/update/:_id",
  authenticate,
  authorizeRoles("admin"),
  updateProductController
);
productsRouter.delete(
  "/admin/delete/:_id",
  authenticate,
  authorizeRoles("admin"),
  deleteProductController
);

productsRouter.put("/reviews/add", authenticate, productReviewController);
productsRouter.get("/reviews/:id", authenticate, getProductReviewController);

productsRouter.get(
  "/admin/products",
  authenticate,
  authorizeRoles("admin"),
  getAdminProductsController
);
productsRouter.get(
  "/admin/reviews",
  authenticate,
  authorizeRoles("admin"),
  getProductReviewsController
);
productsRouter.delete(
  "/admin/reviews/delete",
  authenticate,
  authorizeRoles("admin"),
  deleteReviewController
);

// router
//   .route("/reviews")
//   .get(getProductReviews)
//   .delete(isAuthenticatedUser, deleteReview);
module.exports = { productsRouter };
