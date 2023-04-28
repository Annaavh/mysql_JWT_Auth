
const createPostsTable = `CREATE TABLE IF NOT EXISTS post(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT(30) NOT NULL,
    title VARCHAR(50),
    description VARCHAR(100),
    image VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;

module.exports = createPostsTable;
