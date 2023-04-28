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

const getAllUsers = async (req, res) => {
  db.query(
    `SELECT users.*, CONCAT('[',
    GROUP_CONCAT('{',
      '"id":', post.id, ',',
      '"user_id":', post.user_id, ',',
      '"title":"', post.title, '",',
      '"image":"', post.image, '",',
      '"description":"', post.description, '"'
    '}')
  , ']') AS posts FROM web_app.users JOIN web_app.post ON users.id = post.user_id GROUP BY users.id
  `,
    (err, result) => {
      if (err) res.status(SERVER_ERROR).json(err);
      const parsedResult = result.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        posts: JSON.parse(row.posts),
      }));
      res.status(OK).json(parsedResult);
    }
  );
};
module.exports = getAllUsers;
