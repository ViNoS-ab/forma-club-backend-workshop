const express = require("express");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./connectDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

connectDB().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
