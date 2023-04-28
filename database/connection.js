require("dotenv").config();
const mysql = require("mysql");
const createPostsTable = require("../models/posts");
const createUserTable = require("../models/user");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web_app",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.log(err.message);
    process.exit(1); // Exit the program with an error code
  } else {
    db.query("CREATE DATABASE IF NOT EXISTS web_app", (error, results) => {
      if (error) {
        console.log(error.message);
        process.exit(1); // Exit the program with an error code
      } else {
        console.log("Database created successfully");
      }
    });
    db.query(createPostsTable, (err, result) => {
      if (err) throw err;
      console.log("Posts table created!");
    });
    db.query(createUserTable, (err, result) => {
      if (err) throw err;
      console.log("User table created!");
    });
  }
});

module.exports = db;
