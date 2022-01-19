require("dotenv").config();
require("express-async-errors");
const morgan = require("morgan");
const express = require("express");
const app = express();

//db
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

//middlewares
const errorMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.json({ greeting: "welcome to page", cookie: req.signedCookies });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

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
