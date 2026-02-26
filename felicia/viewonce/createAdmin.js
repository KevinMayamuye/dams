import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "@1admiN23";

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Ensure .env exists in felicia with MONGO_URI.");
    process.exit(1);
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    if (existing) {
      existing.password = hashedPassword;
      existing.role = "admin";
      existing.name = "Admin";
      existing.surname = "Admin";
      await existing.save();
      console.log("Admin user updated. Log in with email:", ADMIN_EMAIL, "and password:", ADMIN_PASSWORD);
    } else {
      await User.create({
        name: "Admin",
        surname: "Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created. Log in with email:", ADMIN_EMAIL, "and password:", ADMIN_PASSWORD);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

run();
