import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/auth.js";

dotenv.config();

let data;

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);

//Home route
app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

//Establish connection to MongoDb using Mongoose
try {
  data = await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB successfully");

  // Run the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.log(error);
}

export default data;
