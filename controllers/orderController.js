const Order = require("../models/order");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");

const { checkPermission } = require("../utils");
const CustomError = require("../errors");

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "random value";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("no cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("please provide tax and shippingFee");
  }

  let orderItems = [];
  let subTotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `no product with id ${item.product} found`
      );
    }
    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];

    subTotal += item.amount * price;
  }
  const total = tax + shippingFee + subTotal;
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    tax,
    shippingFee,
    subTotal,
    total,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new CustomError.NotFoundError(`no order found with id ${id}`);
  }
  checkPermission(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const id = req.params.id;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new CustomError.NotFoundError(`no order found with id ${id}`);
  }
  checkPermission(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
