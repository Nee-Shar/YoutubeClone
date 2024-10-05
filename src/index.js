import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

connectDB();

// (async () => {
//   try {
//    await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//   } catch (e) {
//     console.log("ERROR", e);
//   }
// })(); // IIFE - Immediately Invoked Function Expression
