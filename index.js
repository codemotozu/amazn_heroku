const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const admin = require("./middlewares/admin");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const Product = require("./models/product");

const PORT =  3000;
const app = express();
const DB =
  "mongodb+srv://pomodoro:MdRAg4BkCHvSLkGZ@cluster0.g6nupxo.mongodb.net/";

app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
