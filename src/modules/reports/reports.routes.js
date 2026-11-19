import express from "express";
import { verifyJWT } from "../../middleware/jwt-auth.js";
import  { uploadSingle } from "../../middleware/upload-handler.js";
import { RetriveReportInfoController, UploadReportController } from "./reports.controller.js";

const router = express.Router();

router.get("/retrive/all", verifyJWT, RetriveReportInfoController);
router.post("/upload", verifyJWT, uploadSingle, UploadReportController);

async function uploadFiles (req, res) {
    console.log(req.body);
    console.log(req.files);

    res.json({ message: "Successfully uploaded files" });
}

export default router;