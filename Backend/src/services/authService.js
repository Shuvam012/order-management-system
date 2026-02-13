import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { client } from "../mqtt/mqttClient.js";
import MQTT_TOPICS from "../mqtt/topics.js";

/* ---------- helpers ---------- */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

/* ---------- services ---------- */
 const registerUserService = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("User already exists");

    const user = await User.create({
        name,
        email,
        password,
        role: "customer",
    });

    return user;
};

 const loginUserService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        throw new Error("Invalid credentials");
    }

    // Vendor online logic
    if (user.role === "vendor") {
        user.isOnline = true;
        await user.save();

        setImmediate(() => {
            if (client.connected) {
                client.publish(
                    MQTT_TOPICS.VENDOR_STATUS,
                    JSON.stringify({
                        vendorId: user._id.toString(),
                        status: "online",
                    }),
                    { qos: 1 }
                );
            }
        });
    }

    const token = generateToken(user._id, user.role);
    return { user, token };
};

 const logoutUserService = async (user) => {
    if (user?.role === "vendor") {
        await new Promise((resolve, reject) => {
            client.publish(
                MQTT_TOPICS.VENDOR_STATUS,
                JSON.stringify({
                    vendorId: user._id.toString(),
                    status: "offline",
                }),
                { qos: 1 },
                (err) => (err ? reject(err) : resolve())
            );
        });
    }
};

 const getMeService = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("User not found");
    return user;
};



export { registerUserService, loginUserService, logoutUserService, getMeService };
