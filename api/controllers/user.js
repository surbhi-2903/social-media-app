import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getUser = (req, res) => {
  //TODO
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id =?";
  db.query(q, [userId], (error, data) => {
    if (error) return res.status(200).json(error);
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in !");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token is not valid");
    const q =
      "UPDATE users SET `name`=? , `city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=?";
    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (error, data) => {
        console.log(error);
        if (error) return res.status(500).json(error);
        if (data.affectedRows > 0) return res.status(200).json("Updated");
        return res.status(403).json("You can update only one post");
      }
    );
  });
};


//https://i.pinimg.com/736x/28/63/77/2863777d72589f7823843959e23cb555.jpg
//https://i.pinimg.com/474x/32/1d/e0/321de0fe905ca0b8e212fa6a4447485a.jpg