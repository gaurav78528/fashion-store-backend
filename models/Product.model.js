const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  colors: {
    type: [
      {
        color: {
          type: String,
          required: true,
        },
        images: [String],
        sizes: [String],
      },
    ],
    required: true,
  },
  brand: {
    type: String,
    required: [true, "Please Enter Product Brand."],
  },
  title: {
    type: String,
    required: [true, "Please Enter Product Title."],
  },
  mrp: {
    type: Number,
    required: [true, "Please Enter Product MRP"],
    maxLength: [8, "Price cannot exceed 8 characters."],
  },
  offer: {
    type: Number,
    required: [true, "Please Enter Product offer"],
    maxLength: [2, "Offer cannot be in three digits.."],
  },
  category: {
    type: String,
    required: [true, "Please Enter Product Category."],
  },
  subCategory: {
    type: String,
    required: [true, "Please Enter Product Sub-category."],
  },
  rating: {
    type: Number,
    default: 0,
  },
  new: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Product Stock."],
    maxLength: [4, "Stock cannot exceed 4 Characters."],
    default: 1,
  },
  noOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const ProductModel = mongoose.model("product", productSchema);

module.exports = { ProductModel };
