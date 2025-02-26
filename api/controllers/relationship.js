import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = "SELECT followerUserid from relationships WHERE followedUserid = ?";
  db.query(q, [req.query.followeduserId], (error, data) => {
    if (error) return res.status(500).json(error);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserid));
  });
};
export const postRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in !!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token is not valid !!");
    const q =
      "INSERT INTO relationships (`followerUserid`,`followedUserid`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];
    db.query(q, [values], (error, data) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json("Successfull relationship created");
    });
  });
};
export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in !!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token is not valid!!");
    const q =
      "DELETE FROM relationships WHERE `followerUserid`=(?) AND `followedUserid`=(?)";
    db.query(q, [userInfo.id, req.query.userId], (error, data) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json("Successfully unfollowed");
    });
  });
};
