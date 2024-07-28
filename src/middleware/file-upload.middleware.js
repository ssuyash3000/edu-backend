// import multer from "multer";
// const storageConfig = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public");
//     },
//     filename: (req, file, cb) => {
//         //Timestamp being used as the prefix filename with
//         // orignal file name, in case two files with same name
//         //is uploaded.
//         const name = Date.now() + "-" + file.originalname;
//         cb(null, name);
//     },
// });

// export const uploadFile = multer({
//     storage: storageConfig,
// });
import multer from "multer";
import path from "path";

// Set up storage configuration
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/notice");
    },
    filename: (req, file, cb) => {
        const name = Date.now() + "-" + file.originalname;
        cb(null, name);
    },
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".pdf") {
        return cb(new Error("Only PDFs are allowed"), false);
    }
    cb(null, true);
};
export const uploadFile = multer({
    storage: storageConfig,
});
