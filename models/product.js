const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please provide a name"],
      maxLength: [100, "product name shouldn't exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "please provide a price"],
    },
    description: {
      type: String,
      required: [true, "please provide description"],
      maxLength: [1000, "description can't exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "please provide a category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    image: {
      type: String,
      default: "uploads/image",
    },
    colors: {
      type: [String],
      required: true,
    },
    company: {
      type: String,
      required: [true, "please provide a company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
