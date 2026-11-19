import { deleteFile, uploadFiles } from "../../storage/supabase.storage.js";
import { ApiError } from "../../utils/error.js";
import { customSearch } from "../auth/auth.repository.js";
import { createReport, retriveReportInfo } from "./reports.repository.js";

export const uploadReportService = async (data) => {
    const userExists = await customSearch({
        queryField: "user_id",
        tableName: "users",
        data: data.userId
    });

    if (!userExists) {
        throw new ApiError(
            404,
            "INVALID_CREDENTIALS",
            "Invalid User"
        )
    }

    const fileUpload = await uploadFiles(data.file, data.userId);

    try {

        const requestData = {
            ...data,
            ...fileUpload
        };

        const report = await createReport(requestData);

        console.log("Created Report", report);

        if (!report) {
            throw new ApiError(
                200,
                "FAIL_DATA_CREATION",
                "Failed to create the report"
            );
        }

        return {
            message: "Successfully created the report",
            data: {
                report: {
                    title: report.title,
                    testType: report.test_type,
                    testDate: report.test_date,
                    reasonForTest: report.reason_for_test,
                    doctorName: report.doctor_name,
                    doctorFindings: report.doctor_findings,
                    diagnosticCenterName: report.diagnostic_center_name,
                    followUpStatus: report.follow_up_status,
                    createdAt: report.created_at
                }
            }
        };
    } catch (error) {
        try {
            await deleteFile(fileUpload.storageKey);
        } catch (cleanupError) {
            throw new ApiError(
                400,
                "DATA_DELETION_FAILED",
                "Failed to clean up uploaded file"
            )
        }
    }
}

export const retriveReportInfoService = async (userId) => {
    const reportExists = await customSearch({
        queryField: "user_id",
        tableName: "users",
        data: userId
    });

    if (!reportExists) {
        throw new ApiError(
            404,
            "INVALID_CREDENTIALS",
            "Invalid User"
        );
    }

    const reports = await retriveReportInfo(userId);

    if (!reports) {
        throw new ApiError(
            500,
            "FAILED_TO_FETCH",
            "Failed to retrive the reports"
        );
    }

    console.log(reports);

    return {
        message: "Successfully fetch all the reports information",
        data: {
            reports
        }
    };
}