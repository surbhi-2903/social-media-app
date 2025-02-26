import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = parseInt(req.query.userId);
  //to get userid we use the accessToken in the cookie, we signed that token with secret key with userid.
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userData) => {
    if (error) return res.status(403).json("Token is not valid!");
    //the posts displayed for a user should be his own posts and posts of a person they follow.
    const q = userId
      ? "SELECT p.*,u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (p.userId = u.id) WHERE p.userId=? ORDER BY p.createdAt DESC"
      : "SELECT p.*,u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (p.userId = u.id) LEFT JOIN relationships AS r ON (p.userId = r.followedUserid) WHERE r.followerUserid = ? OR p.userId =? ORDER BY p.createdAt DESC";
    const values = userId ? [userId] : [userData.id, userData.id];
    db.query(q, values, (error, data) => {
      if (error) return res.status(500).json(error);
      if (data.length === 0) return res.json("No posts found");
      return res.status(200).json(data);
    });
  });
};
export const addPost = (req, res) => {
  //to get the user id we use accessToken being provided to backend .
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userData) => {
    if (error) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO posts (`desc`,`image`,`userId`,`createdAt`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      userData.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q, [values], (error, data) => {
      console.log(values);
      console.log(error); //this is how we cancheck the error in case of database errors.
      if (error) return res.status(500).json(error);
      return res.status(200).json("Successfully posted");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      console.log(err);
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
