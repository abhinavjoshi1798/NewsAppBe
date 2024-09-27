const express = require("express");
const { getNews } = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/getnews", getNews);

module.exports = {
  userRouter,
};