const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {

  // get the token
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // convert the raw token to validate token
  const jwtToken = token.replace("Bearer", "").trim();
  
  try {

    // decode the token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);  // Ensure to use the correct secret key (JWT_SECRET)
    
    // Find the user by ID and exclude the password from the response
    const userData = await User.findById(decoded.id).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }


    // Check for admin status if needed (e.g., for admin routes)
    if (req.url.startsWith("/admin")) {
      if (!userData.isAdmin) {
        return res.status(401).json({ message: "Unauthorized: Admin access required" });
      }
    }

    
    req.user = userData; // Attach user data to the request object
    next(); // Call next to proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
