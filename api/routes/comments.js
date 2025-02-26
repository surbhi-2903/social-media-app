import e from "express";
import {
  getComments,
  postComments,
  countComments,
} from "../controllers/comment.js";

const router = e.Router();
router.get("/", getComments);
router.post("/", postComments);
router.get("/getcomments", countComments);
export default router;
