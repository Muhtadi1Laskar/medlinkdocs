import { ApiError } from "../../utils/error.js";
import { customSearch } from "../auth/auth.repository.js";
import { createReport } from "./reports.repository.js";

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

    const report = await createReport(data);

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
}