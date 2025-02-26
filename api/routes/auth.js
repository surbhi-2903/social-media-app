import e from "express";
import { login, logout, register } from "../controllers/auth.js";

const router = e.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
