const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (_id) => {
  // sign(payload, secret, options)
  // header + payload + secret =hash=> signature
  // token = header.payload.signature
  // every calling will create a new token as payload contains a timestamp
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // save user in database
    const user = await User.signup(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
