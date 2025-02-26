import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getLike = (req, res) => {
  const q = "SELECT UserId FROM likes WHERE PostId=?";
  db.query(q, [req.query.postId], (error, data) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(data.map((like) => like.UserId));
  });
};
export const postLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token not authentic");
    const q = "INSERT INTO likes(UserId,PostId) VALUES (?)";
    const values = [userInfo.id, req.body.postId];
    db.query(q, [values], (error, data) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json("Successfully liked the post");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) {
      console.error("JWT Verification Error:", error);
      return res.status(403).json("Token not authentic");
    }

    const postId = req.query.postId; // Get postId from query
    if (!postId) {
      console.error("postId is missing in request");
      return res.status(400).json("postId is required!");
    }

    const q = "DELETE FROM likes WHERE UserId=? AND PostId=?";

    db.query(q, [userInfo.id, req.query.postId], (error, data) => {
      if (error) {
        console.error("SQL Delete Error:", error);
        return res.status(500).json(error);
      }
      return res.status(200).json("Successfully disliked the post");
    });
  });
};
