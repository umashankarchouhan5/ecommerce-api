require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

//db
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

//middlewares
const errorMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limiter");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

app.use("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(fileUpload());
app.use(express.static("./public"));
app.use(cookieParser(process.env.JWT_SECRET));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.json({ greeting: "welcome to page", cookie: req.signedCookies });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
