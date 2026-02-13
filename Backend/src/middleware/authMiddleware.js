import jwt from "jsonwebtoken";
import User from "../models/User.js";



// const protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         try {
//             token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select("-password");
//             next();
//         } catch (error) {
//             res.status(401).json({ message: "Not authorized, token failed" });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: "Not authorized, no token" });
//     }
// };

// Role-based access

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Cookie-based auth
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2️⃣ Header-based auth (fallback)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};





const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied" });
    }
    next();
  };
};



export { protect, authorize };