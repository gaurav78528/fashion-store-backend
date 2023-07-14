const express = require("express");
const path = require("path");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authenticate } = require("./middlewares/authenticate.middleware");
const { productsRouter } = require("./routes/products.route");
const { wishlistRouter } = require("./routes/wishlist.route");
const { orderRouter } = require("./routes/orderRoute");
const { paymentRouter } = require("./routes/payment.Route");

// const cookieParser = require("cookie-parser");

// dotenv config
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

// Middlewares
// app.use(morgan("dev"));


app.use(express.json());
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
// Routes

app.use("/users", userRouter);
// app.use(authenticate);
app.use("/products", productsRouter);
app.use("/wishlist", wishlistRouter);
app.use("/orders", orderRouter);
app.use("/payment", paymentRouter);

// Rest API
app.get("/checkhealth", (req, res) => {
  res.send({ message: "Fashion is live" });
});

// All remaining requests return the React app, so it can handle routing.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to Database Successfully.");
  } catch (error) {
    console.log("Connection to Database Failed.");
    console.log(error);
  }
  console.log(`Server Running on Port ${PORT}`);
});
