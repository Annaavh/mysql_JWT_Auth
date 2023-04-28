const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const users = require("./routes/users");
const posts = require("./routes/posts");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/users", users);
app.use("/api/posts", authenticateToken, posts);

app.listen(4000, () => console.log(`app is running ${process.env.PORT}`));
