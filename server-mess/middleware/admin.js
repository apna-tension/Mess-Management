const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {

  // get the user token from the server
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  // convert the raw token to json web token (this token neet to decrypt before use)
  const jwtToken = token.replace("Bearer", "").trim();

  try {

    // decode/decrypt the encrypted token using the secret code
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET); // Ensure to use the correct secret key (JWT_SECRET)

    // Find the user by ID and exclude the password from the response
    const userData = await User.findById(decoded.id).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userData.isAdmin) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Admin access required" });
    }

    req.user = userData; // Attach user data to the request object
    next(); // Call next to proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = adminMiddleware;
