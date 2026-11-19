import express from "express";
import { verifyJWT } from "../../middleware/jwt-auth.js";
import { uploadSingle } from "../../middleware/upload-handler.js";
import {
    RetriveFileURLController,
    RetriveReportInfoController,
    UploadReportController
} from "./reports.controller.js";

const router = express.Router();

router.get("/retrive/all", verifyJWT, RetriveReportInfoController);
router.post("/upload", verifyJWT, uploadSingle, UploadReportController);
router.post("/retrive/link", verifyJWT, RetriveFileURLController);


export default router;