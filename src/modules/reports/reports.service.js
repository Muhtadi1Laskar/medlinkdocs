import { deleteFile, getFileURL, uploadFiles } from "../../storage/supabase.storage.js";
import { ApiError } from "../../utils/error.js";
import { customExistCheck } from "../auth/auth.repository.js";
import { createReport, deleteFileMetaData, retriveFileMetaData, retriveReportInfo } from "./reports.repository.js";

export const uploadReportService = async (data) => {
    const userExists = await customExistCheck({
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
            );
        }
    };
}

export const retriveReportInfoService = async (userId) => {
    const reportExists = await customExistCheck({
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

    return {
        message: "Successfully fetch all the reports information",
        data: {
            reports
        }
    };
}

export const retriveFileURLService = async ({
    userId,
    reportId,
    isDownloadAble
}) => {
    const reportExists = await customExistCheck({
        queryField: "report_id",
        tableName: "report",
        data: reportId
    });

    if (!reportExists) {
        throw new ApiError(
            404,
            "NO_DATA_FOUND",
            "There is no report under the given report ID. "
        );
    }
    
    const fileMetaData = await retriveFileMetaData({
        userId,
        reportId
    });

    if (!fileMetaData) {
        throw new ApiError(
            500,
            "FAILED_TO_FETCH",
            "Failed to retrive meta data"
        );
    }

    const signedURL = await getFileURL({
        storageKey: fileMetaData.storage_key,
        isDownloadAble: isDownloadAble,
        originalFilename: fileMetaData.original_filename
    });

    return {
        message: "Successfully retrived the file",
        data: {
            report: {
                mimeType: fileMetaData.mime_type,
                originalFilename: fileMetaData.original_filename,
                fileURL: signedURL.url
            }
        }
    };
}

export const deleteFleService = async ({
    userId,
    reportId
}) => {
    const report = await retriveFileMetaData({
        userId,
        reportId
    });

    if (!report) {
        throw new ApiError(
            404,
            "NO_DATA_FOUND",
            "Report not found"
        );
    }

    try {
        await deleteFile(report.storage_key);
    } catch (error) {
        console.error("Storage deletion failed", {
            reportId,
            error
        });

        throw new ApiError(
            400,
            "DATA_DELETION_FAILED",
            "Failed to clean up uploaded file"
        );
    }

    try {
        const deletedReport = await deleteFileMetaData({
            userId,
            reportId
        });

        if (!deletedReport) {
            throw new ApiError(
                400,
                "DATA_DELETION_FAILED",
                "Failed to delete the report meta data"
            );
        }

        return {
            message: "Successfully deleted the report",
            data: {
                report: deletedReport
            }
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        console.error("Database deletion failed", {
            reportId,
            error
        });

        throw new ApiError(
            500,
            "DATA_DELETION_FAILED",
            "Failed to delete report metadata"
        );
    }
}