const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc Register a new User
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // check if the user
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created!" });
  } catch (error) {
    next(error);
  }
};

// @desc Login a User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid creds" });
    }

    // match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid creds" });
    }

    // generate jwt
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Logged In", token });
  } catch (error) {
    next(error);
  }
};
