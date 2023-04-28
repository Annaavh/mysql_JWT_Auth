const asyncHandler = require("express-async-handler");
const db = require("../database/connection.js");
const bcrypt = require("bcryptjs");
const { constants } = require("../constants.js");
const { VALIDATION_ERROR, SERVER_ERROR, OK } = constants;
const {registerSchema} = require("../validators/userValidation.js");


const register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  const { name, email, password } = value;
  if (error) {
    return res
      .status(VALIDATION_ERROR)
      .json({ error: error.details[0].message });
  } else {
    db.query(
      "SELECT email FROM web_app.users WHERE email=?",
      [email],
      async (err, result) => {
        if (err) throw err;
        if (result.length) {
          return res
            .status(VALIDATION_ERROR)
            .json({ message: "User has already been registered!" });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          db.query(
            "INSERT INTO web_app.users SET ?",
            { name, email, password: hashedPassword },
            (err, result) => {
              if (err) throw err;
              db.query(
                "SELECT * FROM web_app.users WHERE id=?",
                [result.insertId],
                (err, result) => {
                  if (err) return res.status(SERVER_ERROR).json(err);
                  return res
                    .status(OK)
                    .json({ message: "User registered successfully!", result });
                }
              );
            }
          );
        }
      }
    );
  }
});
module.exports = register;
