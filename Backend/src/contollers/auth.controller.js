const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model");

async function registerController(req, res) {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if the username and email are not there in DB

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    // agar username ke basis pai user milgaya then return karna , ya fir email ke basis pai user milgaya then usko return karna

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "Account already exists with this email or username",
      });
    }

    // hash the password first

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Error in login controller : ", err);
    res.status(500).json({ message: "Server error during registeration" });
  }
}

async function loginController(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if account exists with the email or not

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // if the user exists then compare its password

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // if all the things are right then give the token

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User loggedIn successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Error in login controller : ", err);
    res.status(500).json({ message: "Server error during login" });
  }
}

async function logoutController(req, res) {
  const token = req.cookies.token;

  // add the token to db
  if (token) {
    await tokenBlackListModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({ message: "User logged out successfully" });
}

async function getMeController(req, res) {
  // first the request will be passed to the middleware if all correct then the payload will be attached to the req.user

  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController,
};
