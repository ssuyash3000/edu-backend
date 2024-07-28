import multer from "multer";
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        //Timestamp being used as the prefix filename with
        // orignal file name, in case two files with same name
        //is uploaded.
        const name = Date.now() + "-" + file.originalname;
        cb(null, name);
    },
});

export const uploadFile = multer({
    storage: storageConfig,
});
