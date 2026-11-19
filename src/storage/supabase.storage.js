import { randomUUID } from "node:crypto";
import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/error.js";

const BUCKET = process.env.SUPABASE_BUCKET;

export const uploadFiles = async (file, userId) => {
    const extentionMap = {
        "application/pdf": "pdf",
        "image/jpeg": "jpeg",
        "image/png": "png"
    };

    const extension = extentionMap[file.mimetype];

    if (!extension) {
        throw new ApiError(
            415,
            "UNSUPPORTED_FORMAT",
            "Unsupported file type"
        );
    }

    const storageKey = `${userId}/${randomUUID()}.${extension}`;

    const { data, error } = await supabase
        .storage
        .from(BUCKET)
        .upload(storageKey, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
            cacheControl: "3600"
        });

    if (error) {
        throw new ApiError(
            500,
            "FAIL_DATA_CREATION",
            "Failed to upload the file"
        );
    }


    return {
        storageKey: data.path,
        storageProvider: "supabase",
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size
    };
}

export const deleteFile = async (storageKey) => {
    const { error } = await supabase
        .storage
        .from(BUCKET)
        .remove([storageKey])

    if (error) {
        throw new ApiError(
            500,
            "FAIL_DATA_DELETION",
            "Failed to delte the uploaded data"
        );
    }
}

export const downloadData = async (storageKey) => {
    const { data, error } = await supabase
        .storage
        .from(BUCKET)
        .download(storageKey);

    if(error) {
        throw new ApiError(
            500,
            "FAIL_DATA_RETRIVAL",
            "Failed to download the file"
        );
    }
}