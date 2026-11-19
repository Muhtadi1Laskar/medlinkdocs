import multer from "multer";

const acceptedFileTypes = ["text/plain", "application/pdf", "image/jpeg", "image/png"];
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 1,
        fields: 15,
        parts: 16
    },
    fileFilter: (req, file, cb) => {
        if(acceptedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    }
});

export const uploadSingle = upload.single("files");
export const uploadMultiple = upload.array("files", 5);
