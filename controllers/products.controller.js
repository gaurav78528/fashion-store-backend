const { ProductModel } = require("../models/Product.model");
const ApiFeatures = require("../utils/apifeature");

// GET ALL PRODUCTS

const getProductsController = async (req, res) => {
  try {
    const resultPerPage = 100;
    const productsCount = await ProductModel.countDocuments();
    const apiFeature = new ApiFeatures(ProductModel.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    // const products = await ProductModel.find();
    const products = await apiFeature.query;
    // console.log(products);
    return res
      .status(200)
      .json({ success: true, products, productsCount, resultPerPage });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong!", error: error.message });
  }
};
const getAdminProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong!", error: error.message });
  }
};

// GET SINGLE PRODUCT
const getSingleProductController = async (req, res) => {
  const ID = req.params;
  // console.log(ID);
  try {
    const product = await ProductModel.findOne({ _id: ID });
    // console.log(product);
    return res.json({ product });
  } catch (error) {
    console.log(error);
    console.log(error);
    return res.send({ message: "Something Went Wrong!", error: error.message });
  }
};

// ADD PRODUCTS   --> FOR ADMIN ONLY
const addNewProductController = async (req, res) => {
  const payload = req.body;
  // console.log(req);
  // console.log(payload);
  try {
    req.body.user = req.user.id;
    const newProduct = new ProductModel(payload);

    await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Product Added Successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong!", error: error.message });
  }
};

// UPDATE PRODUCT FOR ADMIN ONLY
const updateProductController = async (req, res) => {
  const { _id } = req.params;
  const payload = req.body;
  try {
    let product = await ProductModel.findById(_id);
    if (!product) {
      return res.status(500).json({
        message: "Product Not Found.",
      });
    }
    product = await ProductModel.findByIdAndUpdate(_id, payload, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully.",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

// DELETE PRODUCT FOR ADMIN ONLY

const deleteProductController = async (req, res) => {
  const { _id } = req.params;
  try {
    let product = await ProductModel.findById(_id);
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found.",
      });
    }

    await ProductModel.findByIdAndDelete({ _id });

    return res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Went Wrong!", error: error.message });
  }
};

// CRETAE AND UPDATE PRODUCT REVIEW

const productReviewController = async (req, res) => {
  const { rating, comment, productID } = req.body;
  // console.log(req.user.firstName);
  try {
    const review = {
      user: req.user._id,
      name: req.user.firstName,
      rating: Number(rating),
      comment,
    };

    const product = await ProductModel.findById(productID);

    const isReviewed = product.reviews.find(
      (item) => item.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((item) => {
        if (item.user.toString() === req.user._id.toString()) {
          item.rating = rating;
          item.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.noOfReviews = product.reviews.length;
    }
    let avg = 0;

    product.reviews.forEach((item) => {
      avg += item.rating;
    });

    product.rating = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

// GET ALL REVIEWS OF A PRODUCT
const getProductReviewController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found.",
      });
    }

    return res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

// Get All Reviews of a product
const getProductReviewsController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.query.id);
    console.log(product);
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found.",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

// Delete Review
const deleteReviewController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found.",
      });
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await ProductModel.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {}
};

module.exports = {
  getProductsController,
  getSingleProductController,
  addNewProductController,
  updateProductController,
  deleteProductController,
  productReviewController,
  getProductReviewController,
  getAdminProductsController,
  getProductReviewsController,
  deleteReviewController,
};
