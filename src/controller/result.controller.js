import { ResultRepository } from "../repository/result.repository.js";
// const xlsx = require("xlsx");
import xlsx from "xlsx";
export default class ResultController {
    constructor() {
        this.resultRepository = new ResultRepository();

        // Bind methods to the class instance
        this.viewResults = this.viewResults.bind(this);
        this.deleteResult = this.deleteResult.bind(this);
        this.getResultView = this.getResultView.bind(this);
    }
    async uploadResults(req, res) {
        try {
            const { className, examName } = req.body;
            const filePath = req.file.path;

            // Read and parse the Excel file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const results = xlsx.utils.sheet_to_json(sheet);

            const resultData = {
                className,
                examName,
                results,
            };
            console.log(resultData);
            await this.resultRepository.uploadResults(resultData);
            res.redirect("/admin/view-results");
            // Respond with success message
            // res.status(200).send("Results uploaded successfully");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error uploading results");
        }
    }

    async viewResults(req, res, next) {
        try {
            let results = await this.resultRepository.viewResults();
            res.render("Result List", {
                results,
                userEmail: req.session.userEmail,
            });
        } catch (err) {
            next(err);
        }
    }
    async viewResultsAPI(req, res, next) {
        try {
            let results = await this.resultRepository.viewResults();
            res.status(200).json(results);
        } catch (err) {
            next(err);
        }
    }
    async viewResultAdmin(req, res, next) {
        try {
            const { start = 0, end = 10 } = req.query;
            const results = await this.resultRepository.viewResults(
                parseInt(start),
                parseInt(end)
            );

            const prevStart = start > 0 ? start - 10 : 0;
            const prevEnd = end - 10;
            const nextStart = parseInt(end);
            const nextEnd = parseInt(end) + 10;

            res.render("Result List Admin", {
                results,
                userEmail: req.session.userEmail,
                start: parseInt(start),
                end: parseInt(end),
                prevStart,
                prevEnd,
                nextStart,
                nextEnd,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteResult(req, res, next) {
        try {
            const { id, start, end } = req.params;
            await this.resultRepository.deleteResult(id);
            res.redirect(`/admin/view-results/?start=${start}&end=${end}`);
        } catch (err) {
            next(err);
        }
    }

    // async viewResultById(req, res) {
    //     const { id } = req.params;
    //     const db = getDB();
    //     const collection = db.collection("results");

    //     collection.findOne({ _id: new ObjectId(id) }, (err, result) => {
    //         if (err || !result) {
    //             return res.status(404).send("Result not found.");
    //         }
    //         res.render("view-result", { result });
    //     });
    // }
    async getResultView(req, res) {
        const { id } = req.params;

        const { rollNumber } = req.query;
        let studentResult = null;
        if (rollNumber) {
            studentResult = await this.resultRepository.getResultByRollNumber(
                id,
                rollNumber
            );
        }

        let result = await this.resultRepository.viewResultById(id);
        res.render("View Result", {
            result,
            studentResult,
            userEmail: req.session.userEmail,
        });
    }
    // async getResultByRollNumber(req, res) {
    //     try {
    //         const { id } = req.params;

    //         res.render("View Result", { result, studentResult });
    //     } catch (err) {
    //         next(err);
    //     }
    // }
}
