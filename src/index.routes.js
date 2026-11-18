import express from "express";
import authRouter from "./modules/auth/auth.routes.js";
import documentRouter from "./modules/reports/reports.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/documents", documentRouter);

export default router;