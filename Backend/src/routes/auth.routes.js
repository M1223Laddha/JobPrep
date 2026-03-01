const express = require("express");
const authController = require("../contollers/auth.controller");
const authmiddleware = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);
authRouter.get("/logout", authController.logoutController);
authRouter.get(
  "/get-me",
  authmiddleware.authUser,
  authController.getMeController,
); // get the current logged in user details

module.exports = authRouter;
