import express from "express";
import { SignupController } from "./auth.controller.js";

const router = express.Router();

router.post("/register", SignupController);

export default router;
