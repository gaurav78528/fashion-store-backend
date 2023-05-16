require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const stripe = require('stripe')('sk_test_51N09xTSFRtbDh01AubRtZ3v5GimppCBj5j6feOh8cQ1Z1nlgLWHH4YSakVSDimY15ZIV2Zi9RWMKmCJIxlZUq8xJ00jMdGyfhI')

// const processPayment = async (req, res) => {
//   console.log(req.body);
//   const session = await stripe.checkout.sessions.create({
//     // shipping_address_collection: {
//     //   allowed_countries: ["IN", "US", "CA"],
//     // },
//     line_items: [
//       {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: "Amount Payble",
//           },
//           unit_amount: req.body.totalAmt * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${process.env.FRONTEND_URL}/payment/success`,
//     cancel_url: `${process.env.FRONTEND_URL}/cart`,
//   });

//   res.json({ url: session.url });
// };

const processPayment = async (req, res) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "fashionStore",
      },
    });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
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

const sendStripeApiKey = async (req, res) => {
  try {
    res.status(200).json({
      stripeApiKey: process.env.STRIPE_API_KEY,
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

module.exports = { processPayment, sendStripeApiKey };
