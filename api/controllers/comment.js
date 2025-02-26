import moment from "moment";
import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getComments = (req, res) => {
  const q =
    "SELECT c.*,u.id AS userId,u.name,u.profilePic FROM comments AS c JOIN users AS u ON (c.userid=u.id) WHERE c.postid=? ORDER BY c.createdAt DESC";
  db.query(q, [req.query.postId], (error, data) => {
    if (error) return res.status(500).json(error);
    if (data.length == 0) return res.json("No comments");
    return res.status(200).json(data);
  });
};
export const postComments = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO comments (`desc`,`createdAt`,`userid`,`postid`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];
    db.query(q, [values], (error, data) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json("Comment added successfully");
    });
  });
};
export const countComments = (req, res) => {
  const q = `SELECT COUNT(*) AS count FROM comments WHERE postid=?`;
  db.query(q, [req.query.postId], (error, data) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(data);
  });
};
