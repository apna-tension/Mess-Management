const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET); // Ensure to use the correct secret key (JWT_SECRET)

    // Find the user by ID and exclude the password from the response
    const userData = await User.findById(decoded.id).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("user data is : ", userData);
    // console.log("user role is : ", userData.role);
    // console.log("user is admin : ", userData.role === "admin");
    // console.log("user is admin : ", userData.role === "user");
    // Check for admin status if needed (e.g., for admin routes)
    if (userData.role === "user") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Manager access required" });
    }

    req.user = userData; // Attach user data to the request object
    next(); // Call next to proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = adminMiddleware;
