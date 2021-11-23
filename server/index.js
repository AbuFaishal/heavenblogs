require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("./db/conn");
//fixing cors error
const cors = require("cors");
//importing middlewares

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));//note always add it first

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//importing router
const route = require("./Routing/routing");
app.use(route);
const Port = process.env.PORT || 8000;
//listening to port
app.listen(Port, () => {
  console.log(`port running at ${Port}`);
})