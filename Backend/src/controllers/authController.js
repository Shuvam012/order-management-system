
import { registerUserService,
  loginUserService,
  logoutUserService,
  getMeService

 } from "../services/authService.js";
 import User from "../models/User.js";


// register
  const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await registerUserService({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// login
 const loginUser = async (req, res) => {
  try {
    const { user, token } = await loginUserService(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};



const logoutUser = async (req, res) => {
  try {
    console.log("Logout attempt - req.user:", req.user); // Debug log

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get the user ID
    const userId = req.user._id ||  req.user;
    
  
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Now call the service with the full user object
    await logoutUserService(user);

    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(0),
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err); // Debug log
    res.status(500).json({ message: err.message || "Logout failed" });
  }
};

// get me
 const getMe = async (req, res) => {
  try {
    const user = await getMeService(req.cookies.token);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};




export { registerUser, loginUser, logoutUser, getMe };