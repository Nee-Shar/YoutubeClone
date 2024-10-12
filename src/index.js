import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running on PORT ", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("MONGO Connection ERROR  ", e);
  });

// (async () => {
//   try {
//    await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//   } catch (e) {
//     console.log("ERROR", e);
//   }
// })(); // IIFE - Immediately Invoked Function Expression
