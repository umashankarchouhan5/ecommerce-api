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
      default: 0,
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
      default: "uploads/noimage.jpg",
    },
    colors: {
      type: [String],
      default: ["#222"],
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
    numOfReviews: {
      type: Number,
      default: 0,
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

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
