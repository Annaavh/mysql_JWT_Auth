const jwt = require("jsonwebtoken");
const db = require("../database/connection.js");
const bcrypt = require("bcryptjs");
const { constants } = require("../constants.js");
const { loginSchema } = require("../validators/userValidation.js");
const { VALIDATION_ERROR, SERVER_ERROR, OK,FORBIDDEN,NOT_FOUND,UNAUTHORIZED } = constants;


const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  const { email, password } = value;
  if (error) {
    return res
      .status(VALIDATION_ERROR)
      .json({ error: error.details[0].message });
  }
  else {
    db.query(
      "SELECT id,email,password FROM web_app.users WHERE email=?",
      [email],
      async (err, result) => {
        const user = result && result[0];
        if (err) {
          console.log(err);
          res.status(SERVER_ERROR).json({ message: "Internal server error" });
        } else if (
          !result.length > 0 ||
          !(await bcrypt.compare(password, user.password))
        ) {
          return res
            .status(UNAUTHORIZED)
            .json({ message: "Incorret Email or Password!" });
        } else {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            process.env.ACCESS_TOKEN,
            {
              expiresIn: process.env.JWT_EXPIRES,
            }
          );
          const refreshToken = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            process.env.JWT_SECRET
          );

          res.cookie("refreshToken", refreshToken, {
            maxAge: 900000,
            httpOnly: true,
          });
          res.cookie("token", token, { maxAge: 900000 });

          res.status(OK).json({ token, refreshToken });
        }
      }
    );
  }
};

const refreshToken = async (req, res) => {
  // console.log(req.cookies, "-- 6 cookie");
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken == null) return res.sendStatus(UNAUTHORIZED);

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(FORBIDDEN);

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(OK).json({ token });
  });
};

module.exports = { login, refreshToken };
