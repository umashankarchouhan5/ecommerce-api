const Review = require("../models/review");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermissions = require("../utils/checkPermission");

const getAllReview = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name price company",
  });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getReview = async (req, res) => {
  const id = req.params.id;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const createReview = async (req, res) => {
  req.body.user = req.user.userId;
  const { product: productId } = req.body;
  isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `no product exist with id ${productId}`
    );
  }

  const reviewAlreadyExist = await Review.findOne({
    user: req.user.userId,
    product: productId,
  });
  if (reviewAlreadyExist) {
    throw new CustomError.BadRequestError("review already exists");
  }
  const review = await Review.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ review });
};
const updateReview = async (req, res) => {
  const id = req.params.id;
  const { rating, comment, title } = req.body;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id ${id}`);
  }
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.comment = comment;
  review.title = title;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const id = req.params.id;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id ${id}`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "review successfully deleted" });
};
const getSingleProductReview = async (req, res) => {
  const id = req.params.id;
  const reviews = await Review.find({ product: id });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  getAllReview,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
