import express from "express";
import {getRelationships,postRelationship,deleteRelationship} from "../controllers/relationship.js"
const router = express.Router();
router.get("/", getRelationships);
router.post("/", postRelationship);
router.delete("/", deleteRelationship);
export default router;
