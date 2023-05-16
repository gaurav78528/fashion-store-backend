const express = require("express");
const {
  getWishlistController,
  addToWishlistController,
  removeFromWishlistController,
} = require("../controllers/wishlist.controller");


const wishlistRouter = express.Router();

wishlistRouter.get("/", getWishlistController);
// productsRouter.get("/:_id", getSingleProductController);
wishlistRouter.post("/add", addToWishlistController);
wishlistRouter.delete("/delete/:_id", removeFromWishlistController);

module.exports = { wishlistRouter };
