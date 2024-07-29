import multer from "multer";
// import { readFile, utils } from "xlsx";
import path from "path";

// const upload = multer({ dest: "uploads/" });
// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
export const uploadResultFile = multer({ storage });
// const uploadResults = (req, res) => {
//     const { className, examName } = req.body;
//     const file = req.file;

//     if (!file) {
//         return res.status(400).send("No file uploaded.");
//     }

//     const workbook = readFile(file.path);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = utils.sheet_to_json(sheet);

//     const db = getDB();
//     const collection = db.collection("results");

//     const resultDocument = {
//         className,
//         examName,
//         results: data,
//     };

//     collection.insertOne(resultDocument, (err, result) => {
//         if (err) {
//             return res.status(500).send("Error saving results to database.");
//         }
//         res.redirect("/admin/view-results");
//     });
// };

// module.exports = {
//     uploadResults,
//     upload,
// };
