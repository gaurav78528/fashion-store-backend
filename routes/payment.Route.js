const express = require("express");

const { authenticate } = require("../middlewares/authenticate.middleware");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/process", authenticate, processPayment);
paymentRouter.get("/stripeapikey", authenticate, sendStripeApiKey);
// paymentRouter.post("/create-checkout-session", authenticate, processPayment);

module.exports = { paymentRouter };
