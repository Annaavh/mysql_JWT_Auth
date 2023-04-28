const { constants } = require("../constants.js");
const db = require("../database/connection.js");
const { postsSchema } = require("../validators/postsValidation.js");
const {
  VALIDATION_ERROR,
  SERVER_ERROR,
  OK,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} = constants;

const createPost = async (req, res) => {
  const { error, value } = postsSchema.validate(req.body);
  const { title, description, image } = value;
  if (error) {
    return res
      .status(VALIDATION_ERROR)
      .json({ error: error.details[0].message });
  }
  const user = req.user;
  db.query(
    "INSERT INTO web_app.post (user_id, title, description, image) VALUES (?, ?, ?, ?)",
    [user.id, title, description, image],
    (err, result) => {
      if (err) return res.status(SERVER_ERROR).json(err);
      db.query(
        "SELECT * FROM web_app.post WHERE id=?",
        [result.insertId],
        (err, result) => {
          if (err) return res.status(SERVER_ERROR).json(err);
          return res
            .status(OK)
            .json({ message: "Post has been created successfully !", result });
        }
      );
    }
  );
};

const getAllPosts = async (req, res) => {
  db.query("SELECT * FROM web_app.post", async (err, result) => {
    if (err)
      return res
        .status(SERVER_ERROR)
        .json({ message: "Internal server error" });
    return res.status(OK).json(result);
  });
};

const getPost = async (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM web_app.post WHERE id=?",
    [id],
    async (err, result) => {
      if (err) return res.status(SERVER_ERROR).json(err);
      if (result.length) {
        res.status(OK).json(result);
      } else {
        return res.status(NOT_FOUND).json({ message: "Post not found !" });
      }
    }
  );
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { error, value } = postsSchema.validate(req.body);
  const { title, description, image } = value;
  if (error) {
    return res
      .status(VALIDATION_ERROR)
      .json({ error: error.details[0].message });
  }
  db.query(
    "UPDATE web_app.post SET title = ?,description=?, image = ? WHERE id = ?",
    [title, description, image, id],
    (err, results) => {
      if (err) return res.status(SERVER_ERROR).json(err);
      if (results["affectedRows"] > 0) {
        db.query(
          "SELECT * FROM web_app.post WHERE id=?",
          [id],
          (err, result) => {
            if (err) return res.status(SERVER_ERROR).json(err);
            return res
              .status(OK)
              .json({ message: "Post updated successfully !", result });
          }
        );
      } else {
        return res.status(NOT_FOUND).json({ message: "Post not found !" });
      }
    }
  );
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM web_app.post WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(SERVER_ERROR).json(err);
    if (result["affectedRows"] > 0) {
      return res
        .status(OK)
        .json({ message: "The post has been deleted successfully !" });
    } else {
      return res.status(NOT_FOUND).json({ message: "Post not found !" });
    }
  });
};

const getMyPosts = async (req, res) => {
  const user = req.user;
  const { from, to, title } = req.query;
  const fromDate = from && new Date(from);
  const toDate = to && new Date(to);
  const fromDateTime = fromDate && fromDate.toISOString();
  const toDateTime = toDate && toDate.toISOString();
  db.query(
    `SELECT * FROM web_app.post WHERE user_id=? AND (
     (? IS NULL OR title LIKE ?) 
     OR 
     (? IS NULL OR created_at >= ?)
      AND 
     (? IS NULL OR created_at <= ?)
      )`,
    [user.id, title, `%${title}%`, from, fromDateTime, to, toDateTime],
    (err, result) => {
      if (err) return res.status(SERVER_ERROR).json(err);
      return res.status(OK).json(result);
    }
  );
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
  getMyPosts,
};
