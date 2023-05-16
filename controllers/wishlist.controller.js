// const getWishlistController = () => {};

const { WishlistModel } = require("../models/Wishlist.model");

const getWishlistController = async (req, res) => {
  try {
    const wishlistItems = await WishlistModel.find();
    console.log(wishlistItems);
    return res.json(wishlistItems);
  } catch (error) {
    console.log(error);
    return res.send({ message: "Something Went Wrong!", error });
  }
};

// const addToWishlistController = () => {};

const addToWishlistController = async (req, res) => {
  const payload = req.body;
  const { _id } = payload;

  try {
    const isProductAlreadyInWishlist = await WishlistModel.findOne(payload);

    if (isProductAlreadyInWishlist) {
      return res.json({ message: "Already in Wishlist" });
    } else {
      const addToWishlist = new WishlistModel(payload);

      await addToWishlist.save();
      return res.json({
        message: "Product Added to Wishlist Successfully.",
        addToWishlist,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({ message: "Something Went Wrong!", error });
  }
};

const removeFromWishlistController = async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    await WishlistModel.findByIdAndDelete({ _id });

    return res.json({ message: "Product Removed From Wishlist." });
  } catch (error) {
    console.log(error);
    return res.send({ message: "Something Went Wrong!", error });
  }
};

module.exports = {
  getWishlistController,
  addToWishlistController,
  removeFromWishlistController,
};
