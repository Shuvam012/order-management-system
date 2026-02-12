import User from "../models/User.js";
// import jwt from "jsonwebtoken";
import jwt from "jsonwebtoken";


const generateToken = (id, role) => {
    return jwt.sign({ id, role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const sendToken = (res, user) => {
  const token = generateToken(user._id, user.role);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};




// register user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: "Email , password & name are required" });
    }


    // if (role === "admin" ) {
    //     return res.status(403).json({ message: "Admin registration not allowed" });
    // }


    try {
        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const user = await User.create({
            name,
            email,
            password,
            //    role
            role: "customer",

        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            // token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// login User 

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }


    try {
        const user = await User.findOne({ email });
         if (user && (await user.matchPassword(password))) {
    sendToken(res, user);
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const logoutUser = async (req, res) => {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  };



export { registerUser, loginUser , logoutUser};