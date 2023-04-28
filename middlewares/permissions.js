const { constants } = require("../constants");
const db = require("../database/connection");
const {
  VALIDATION_ERROR,
  SERVER_ERROR,
  OK,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} = constants;

const permission = (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  db.query(
    "SELECT user_id FROM web_app.post WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(SERVER_ERROR).json(err);
      if (
        result &&
        result[0] &&
        result[0].user_id &&
        result[0].user_id !== user.id
      ) {
        res.status(FORBIDDEN).json({
          message:
            "User don't have permission to update or delete other user's post",
        });
      } else {
        next();
      }
    }
  );
};

module.exports = permission;
