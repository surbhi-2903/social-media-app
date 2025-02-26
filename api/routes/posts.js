import e from "express";
import { getPosts, addPost,deletePost } from "../controllers/post.js";

const router = e.Router();
router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
