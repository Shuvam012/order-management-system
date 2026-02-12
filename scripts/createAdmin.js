// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import User from "../src/models/User.js";

// dotenv.config();



// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI )
//         console.log("MongoDB connected");
//     } catch (error) {
//         console.error("MongoDB connection failed:", error.message);
//         process.exit(1);
//     }
// };


// // const createAdmin = async () => {
// //     try {
// //         await connectDB();  

// //         const adminEmail = process.env.ADMIN_EMAIL;
// //         const adminPassword = process.env.ADMIN_PASSWORD;

// //         if (!adminEmail || !adminPassword) {
// //             console.error("Admin email or password not set in environment variables");
// //             process.exit(1);
// //         }

// //         const existingAdmin = await User.findOne({ email: adminEmail });
// //         if (existingAdmin) {
// //             console.log("Admin user already exists");
// //             process.exit(0);
// //         }
// //         const hashedPassword = await bcrypt.hash(adminPassword, 12);

// //         await User.create({
// //             username: "admin",
// //             email: adminEmail,
// //             password: hashedPassword,
// //             role: "admin",
// //         });

// //         console.log("Admin user created successfully");
// //         process.exit(0);
// //     } catch (error) {
// //         console.error("Error creating admin user:", error);
// //         process.exit(1);

// //     }
// // };  

// const createAdmin = async () => {
//   try {
//     await connectDB();

//     const adminEmail = process.env.ADMIN_EMAIL;
//     const adminPassword = process.env.ADMIN_PASSWORD;

//     if (!adminEmail || !adminPassword) {
//       console.error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
//       process.exit(1);
//     }

//     // ✅ Only one admin allowed
//     const existingAdmin = await User.findOne({ role: "admin" });
//     if (existingAdmin) {
//       console.log("Admin user already exists");
//       process.exit(0);
//     }

//     await User.create({
//       name: "System Admin",
//       email: adminEmail,
//       password: adminPassword, 
//       role: "admin",
//     });

//     console.log("Admin user created successfully");
//     process.exit(0);

//   } catch (error) {
//     console.error("Error creating admin user:", error.message);
//     process.exit(1);
//   }
// };

// createAdmin();





import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log("Admin user created successfully");
    process.exit(0);

  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdmin();
