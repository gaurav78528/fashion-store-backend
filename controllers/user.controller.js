const { UserModel } = require("../models/User.model");
const { sendToken } = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
require("dotenv").config();

const userRegisterController = async (req, res) => {
  const { firstName, email, password } = req.body;
  try {
    const user = await UserModel.create({
      firstName,
      email,
      password,
    });

    // const token = user.getJWTToken();
    // console.log(token);
    sendToken(user, 201, res, "User Registered Successfully.");
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "Failed to Register User.",
      error: error.message,
    });
  }
};

const userLoginController = async (req, res) => {
  const { email, password } = req.body;
  // console.log({ password });
  // console.log(req.user);
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please Fill all Credentials.",
      });
    }
    const user = await UserModel.findOne({ email }).select("+password");
    // console.log(user);

    if (!user) {
      return res.status(401).json({
        message: "Wrong Credentials.",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    // console.log(isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Wrong Credentials.",
      });
    }
    sendToken(user, 200, res, "User Logged In Successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to Login User.",
      error: error.message,
    });
  }
};
const userLogoutController = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed To Logut.",
    });
  }
};

// FORGET PASSSWORD

const forgetPasswordController = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      message: "User Not Found.",
    });
  }

  // GET RESET PASSWORD TOKEN

  const resetToken = user.getResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });

  console.log(process.env.FRONTEND_URL);

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset-password/${resetToken}`;

  const message = `Your password reset link is :- \n\n This Link will expire after 10 minutes. \n\n\ ${resetPasswordUrl} \n\n If you have not requested for reset password then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "FASHION STORE PASSWORD RECOVERY",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    // CREATING TOKEN HASH
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        message: "Reset Password Token in Invalid or has been expired.",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        message: "Password does not matches.",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res, "Password Changed Successfully.");
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Reset Password.",
      error: error.message,
    });
  }
};

// GET USER DETAILS

const getUserDetailsController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get user.",
      error: error.message,
    });
  }
};

// UPDATE PASSWORD

const updatePasswordController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("+password");
    // console.log(user);

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    console.log({ isPasswordMatched });
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Old Password in incorrect.",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        message: "Password does not matches.",
      });
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res, "Password Updated.");

    //  return res.status(200).json({
    //     success: true,
    //     user,
    //   });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL USERS

const getAllUsersController = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET SINGLE USER DETAILS (ADMIN)
const getSingleUserDetailsContoller = async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(400).json({
        message: `User Does exist not With ID ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE USER ADMIN

const updateUserRoleController = async (req, res) => {
  try {
    const newUserData = {
      firstName: req.body.firstName,
      email: req.body.email,
      role: req.body.role,
    };

    await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE USER -ADMIN

const deleteUserController = async (req, res) => {
  // console.log(req.params.id);
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: `User Does exist not With ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "User has been Removed.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
  forgetPasswordController,
  resetPasswordController,
  getUserDetailsController,
  updatePasswordController,
  getAllUsersController,
  getSingleUserDetailsContoller,
  deleteUserController,
  updateUserRoleController,
};
