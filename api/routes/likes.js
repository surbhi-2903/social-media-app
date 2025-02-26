import e from "express";
import { getLike, postLike, deleteLike } from "../controllers/like.js";

const router = e.Router();
router.get("/", getLike);
router.post("/", postLike);
router.delete("/", deleteLike);
export default router;
