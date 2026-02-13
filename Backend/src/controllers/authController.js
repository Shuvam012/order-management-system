import { set } from "mongoose";
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



// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (user && (await user.matchPassword(password))) {

//       if (user.role === "vendor") {
//         try {
//           user.isOnline = true;
//           await user.save();

//           // Safe MQTT publish
//           setImmediate(() => {
//              if (client.connected) {
//             client.publish(
//               MQTT_TOPICS.VENDOR_STATUS,
//               JSON.stringify({ vendorId: user._id, status: "online" }),
//               { qos: 1 }
//             );
//           }
//           },500)
         
//         } catch (err) {
//           console.error("Vendor login update failed:", err.message);
//         }
//       }

//       return sendToken(res, user); // Always return token even if MQTT fails
//     } else {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.error("Login error:", error.message);
//     res.status(500).json({ message: "Server error during login" });
//   }
// };


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) 
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.role === "vendor") {
      user.isOnline = true;
      await user.save();

      // Publish online status to MQTT
      setImmediate(() => {
        if (client.connected) {
          client.publish(MQTT_TOPICS.VENDOR_STATUS, JSON.stringify({ vendorId: user._id, status: "online" }), { qos: 1 });
        }
      });
    }

    return sendToken(res, user);
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};




// const logoutUser = async (req, res) => {
//      if (req.user?.role === "vendor") {
//     req.user.isOnline = false;
//     await req.user.save();
//   }
//     res.cookie("token", null, {
//       httpOnly: true,
//       expires: new Date(0),
//     });
  
//     res.status(200).json({ message: "Logged out successfully" });
//   };

// const logoutUser = async (req, res) => {
//   try {
//     // If the user is a vendor, update status
//     if (req.user?.role === "vendor") {
//       req.user.isOnline = false;
//       await req.user.save();

//       // Publish offline status to MQTT
//       client.publish(
//         MQTT_TOPICS.VENDOR_STATUS,
//         // JSON.stringify({ status: "offline" }),
//         JSON.stringify({ vendorId: req.user._id, status: "offline" }),
//         { qos: 1 }
//       );
//     }

//     // Clear cookie
//     res.cookie("token", null, {
//       httpOnly: true,
//       expires: new Date(0),
//     });

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     console.error("Logout error:", err.message);
//     res.status(500).json({ message: "Server error during logout" });
//   }
// };

// const logoutUser = async (req, res) => {
//   try {
//     if (req.user?.role === "vendor") {
//       // 1. Update Database
//       await User.findByIdAndUpdate(req.user._id, { isOnline: false });

//       // 2. Notify Admin via MQTT/WebSocket
//       publishEvent(MQTT_TOPICS.VENDOR_STATUS, { 
//         vendorId: req.user._id, 
//         status: "offline" 
//       });
//     }

//     res.cookie("token", null, {
//       httpOnly: true,
//       expires: new Date(0),
//     });

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Logout failed" });
//   }
// };

const logoutUser = async (req, res) => {
  try {
    if (req.user?.role === "vendor") {
      await User.findByIdAndUpdate(req.user._id, { isOnline: false });

      client.publish(MQTT_TOPICS.VENDOR_STATUS, JSON.stringify({ vendorId: req.user._id, status: "offline" }), { qos: 1 });
    }

    res.cookie("token", null, { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Server error during logout" });
  }
};




  const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // remove password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};



export { registerUser, loginUser , logoutUser, getMe };