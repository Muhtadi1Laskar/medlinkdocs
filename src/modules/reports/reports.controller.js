import { errorResponse, successResponse } from "../../utils/response.js";
import { uploadReportService } from "./reports.service.js";

export const UploadReportController = async (req, res, next) => {
    try {
        if (!req.file) {
            const responseBody = { 
                message: "No attached files found" 
            };
            errorResponse(res, responseBody, 404);
        }

        const response = await uploadReportService({
            userId: req.userId,
            title: req.body.title,
            testType: req.body.testType,
            testDate: req.body.testDate,
            reasonForTest: req.body.reasonForTest,
            doctorName: req.body.doctorName,
            doctorFindings: req.body.doctorFindings,
            diagnosticCenterName: req.body.diagnosticCenterName,
            followUpStatus: req.body.followUpStatus,
            storageKey: "dasdasd343s21423sadf",
            storageProvider: "Storage Provider",
            originalFilename: req.file.originalname,
            mimeType: req.file.mimetype,
            fullSize: req.file.size
        });

        successResponse(res, response, 200);
    } catch (error) {
        next(error);
    }
}