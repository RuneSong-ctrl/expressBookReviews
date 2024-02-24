const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");

const authRouter = express.Router();

const users = [{ username: "dennis", password: "abc" }];

// Function to check if the username is valid
const isValidUsername = (username) => {
  return users.some((user) => user.username === username);
};

// Function to authenticate user
const authenticateUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Login endpoint
authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (authenticateUser(username, password)) {
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    return res.status(200).json({ accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add a book review
authRouter.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.user;

  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review successfully posted." });
});

// Delete a book review
authRouter.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found." });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review successfully deleted." });
});

module.exports = authRouter;
