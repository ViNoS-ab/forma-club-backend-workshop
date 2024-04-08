const express = require("express");
const UserModel = require("../models/User");
const TaskModel = require("../models/Task");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isAtuhenticated } = require("../middlewares/authorization");

const routes = express.Router();

routes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashedPw });
    res.json({ message: "user created successfully", user });
  } catch (err) {
    res.json({ message: err.message });
  }
});

routes.get("/", async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.json({ message: "users fetched successfully", users });
  } catch (err) {
    res.json({ message: err.message });
  }
});

routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid password" });
    }
    const token = jwt.sign({ id: user.id, username: user.name }, "SEEECREEET KEEEEEY", {
      expiresIn: "1d",
    });


    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // sameSite: "none",
      // secure: true,
      
    })

    res.json({ message: "user logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "error logging in" });
  }
});

// protected routes

routes.use(isAtuhenticated);

routes.get("/profile", async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    user.password = undefined;
    res.json({ message: "user fetched successfully", user });
  } catch (err) {
    res.status(500).json({ message: "error getting user" });
  }
});

routes.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.json({ message: "user fetched successfully", user });
  } catch (err) {
    res.status(500).json({ message: "error getting user" });
  }
});

routes.put("/:id", async (req, res) => {
  try {
    if (req.params.id !== req.user.id)
      return res.status(401).json({ message: "unauthorized", success: false });

    const { name } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.name = name;
    await user.save();

    res.json({ message: "user updated successfully", user });
  } catch (err) {
    res.json({ message: err.message });
  }
});

routes.delete("/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "user deleted successfully", user });
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = routes;


