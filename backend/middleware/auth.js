// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers; // Bearer <token>
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // extract token
  const token = authorization.split(" ")[1]; // "Bearer <token>"

  // verify token
  try {
    const { _id } = jwt.verify(token, process.env.SECRET); // verify the token with the secret key, return the payload
    req.user = await User.findOne({ _id }).select("_id"); // attach the user (_id) to the request object for later use in the controller functions
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Request not authorized" });
  }
};

module.exports = requireAuth;
