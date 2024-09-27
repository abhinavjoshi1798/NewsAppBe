const express = require("express");
const { userRouter } = require("./routes/userRoutes");


const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRouter);


app.listen(process.env.PORT,   () => {
 
  console.log(`server is running at ${process.env.PORT}`);
});