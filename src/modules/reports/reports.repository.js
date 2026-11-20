import pool from "../../config/database.js";

export const createReport = async ({
    userId,
    title,
    testType,
    testDate,
    reasonForTest,
    doctorName,
    doctorFindings,
    diagnosticCenterName,
    followUpStatus,
    storageKey,
    storageProvider,
    originalFilename,
    mimeType,
    fileSize
}) => {
    const queyryStr = `
        INSERT INTO
        report (
            user_id,
            title,
            test_type,
            test_date,
            reason_for_test,
            doctor_name,
            doctor_findings,
            diagnostic_center_name,
            follow_up_status,
            storage_key,
            storage_provider,
            original_filename,
            mime_type,
            file_size
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
    `;

    const result = await pool.query(
        queyryStr,
        [
            userId,
            title,
            testType,
            testDate,
            reasonForTest,
            doctorName,
            doctorFindings,
            diagnosticCenterName,
            followUpStatus,
            storageKey,
            storageProvider,
            originalFilename,
            mimeType,
            fileSize
        ]
    );

    return result.rows[0] ?? null;
}

export const retriveReportInfo = async (userId) => {
    const queryStr = `
        SELECT 
            report_id,
            title,
            test_type,
            test_date,
            reason_for_test,
            doctor_name,
            doctor_findings,
            diagnostic_center_name,
            follow_up_status,
            created_at,
            updated_at
         FROM report 
         WHERE user_id = $1
         ORDER BY test_date DESC
    `;

    const result = await pool.query(queryStr, [userId]);

    return result.rows ?? null;
}

export const retriveFileMetaData = async ({
    userId,
    reportId
}) => {
    const queryStr = `
        SELECT 
            storage_key,
            mime_type,
            original_filename
        FROM report 
        WHERE user_id = $1
            AND report_id = $2 
    `;

    const result = await pool.query(
        queryStr, 
        [ userId, reportId]
    );

    return result.rows[0] ?? null;
}

export const deleteFileMetaData = async ({
    userId,
    reportId
}) => {
    const queryStr = `
        DELETE FROM report
        WHERE user_id = $1 AND report_id = $2
        RETURNING 
            report_id,
            title,
            original_filename
    `;
    const result = await pool.query(
        queryStr, 
        [userId, reportId]
    );

    return result.rows[0] ?? null;
}