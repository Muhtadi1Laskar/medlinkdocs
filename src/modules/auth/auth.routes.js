import express from "express";
import { LoginController, SignupController } from "./auth.controller.js";

const router = express.Router();

router.post("/register", SignupController);
router.post("/login", LoginController);

export default router;
