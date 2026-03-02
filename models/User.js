import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter a valid email address",
      ],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
