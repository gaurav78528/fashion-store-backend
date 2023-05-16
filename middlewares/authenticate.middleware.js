const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  // console.log(req.user);
  // const { token } = req.cookies;
  const { cookies } = req;
  const { token } = cookies;
  console.log({ cookies });

  if (!token) {
    return res.status(401).json({
      message: "Please Login.",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await UserModel.findById(decoded.id);
  // console.log(req.user);
  next();
};

module.exports = {
  authenticate,
};
