const express = require("express");
const {
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
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { authorizeRoles } = require("../middlewares/authorizeRoles.middleware");

const userRouter = express.Router();

// Register Route

userRouter.post("/register", userRegisterController);
userRouter.post("/login", userLoginController);
userRouter.get("/logout", userLogoutController);
userRouter.post("/password/forget", forgetPasswordController);
userRouter.put("/password/reset/:token", resetPasswordController);
userRouter.get("/user", authenticate, getUserDetailsController);
userRouter.put("/user/password/update", authenticate, updatePasswordController);
userRouter.get(
  "/admin/allusers",
  authenticate,
  authorizeRoles("admin"),
  getAllUsersController
);
userRouter.get(
  "/admin/user/:id",
  authenticate,
  authorizeRoles("admin"),
  getSingleUserDetailsContoller
);
userRouter.put(
  "/admin/user/update/:id",
  authenticate,
  authorizeRoles("admin"),
  updateUserRoleController
);
userRouter.delete(
  "/admin/user/delete/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteUserController
);

module.exports = { userRouter };
