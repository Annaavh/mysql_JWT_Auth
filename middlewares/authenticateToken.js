const jwt = require("jsonwebtoken");
const { constants } = require("../constants");
const {
  VALIDATION_ERROR,
  SERVER_ERROR,
  OK,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} = constants;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(UNAUTHORIZED);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(FORBIDDEN);

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
