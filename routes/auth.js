import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

//Function to check if the email submitted isn't already registered
async function checkExists(email) {
  try {
    const user = await User.findOne({ email });
    if (user) {
      return { message: "Email already exists" };
    }
    return { message: "Email not registered" };
  } catch (error) {
    return { message: "Error: Something went wrong" };
  }
}

//Function to get user by email
async function getUser(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    return { message: "Error: Something went wrong" };
  }
}

//GET: Home Endpoint
router.get("/", (req, res) => {
  res.json({ message: "Hello this is the auth route!" });
});

//GET: User Informaton Endpoint
router.get("/user", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
});

//POST: Registration Endpoint
router.post("/register", async (req, res) => {
  const { email, password, firstName } = req.body;

  // Validate registration data
  //Check email is unique
  const result = await checkExists(email);

  if (
    result.message === "Error: Something went wrong" ||
    result.message === "Email already exists"
  ) {
    return res.status(500).json(result);
  }

  //Check email is not empty
  if (!email) {
    return res.status(400).json({ message: "Please enter an email address" });
  }

  //Check password min length
  if (password) {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
  } else {
    return res.status(400).json({ message: "Please enter a password" });
  }

  //Check first name is not empty
  if (!firstName) {
    return res.status(400).json({ message: "Please enter a first name" });
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Create new user
  const user = new User({ email, password: hashedPassword, firstName });
  try {
    await user.save();
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please enter a valid email" });
    } else {
      console.log(error.message);
      return res.status(500).json({ message: "Error: Something went wrong" });
    }
  }

  //Send response
  return res
    .status(200)
    .json({ message: `${firstName} has been registered successfully!` });
});

//POST: Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email);

  //If user exists, passwords will be compared
  if (user !== null) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      //If the password is correct, create a JWT token and send it back to the client
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      //Log Check
      console.log("Generated JWT: ", token);

      return res.status(200).json({ token });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid password, please try again." });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Invalid email, please try again." });
  }
});

export default router;
