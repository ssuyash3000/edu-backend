import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";
//import { ApplicationError } from "../errors/ApplicationError.js";
import path from "path";
// import { dirname } from "path";
import fs, { realpathSync } from "fs";
export class ResultRepository {
    async viewResults(start = 0, end = 10) {
        try {
            const db = getDB();
            const collection = db.collection("results");

            const results = await collection
                .find()
                .skip(start)
                .limit(end - start)
                .toArray();
            return results;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }
    // async viewResults() {
    //     try {
    //         const db = getDB();
    //         const collection = db.collection("results");

    //         const results = await collection.find().toArray();
    //         // return res.status(200).send(results);
    //         return results;
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong", 503);
    //     }
    // }
    async uploadResults(resultData) {
        try {
            const db = getDB();
            const collection = db.collection("results");
            // Insert the result data into the database
            await collection.insertOne(resultData);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }
    async viewResultById(id) {
        // const { id } = req.params;
        const db = getDB();
        const collection = db.collection("results");
        // Use await with findOne
        const result = await collection.findOne({ _id: new ObjectId(id) });

        // Handle case where result is not found
        if (!result) {
            return res.status(404).send("Result not found.");
        }
        return result;
    }

    async getResultByRollNumber(id, rollNumber) {
        // const { id } = req.params;
        // const { rollNumber } = req.query;
        try {
            const db = getDB();
            const collection = db.collection("results");
            const result = await collection.findOne({ _id: new ObjectId(id) });

            if (!result) {
                return res.status(404).send("Result not found.");
            }

            const studentResult = result.results.find(
                (r) => r["Student Roll"] === parseInt(rollNumber)
            );

            return studentResult;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }
    async deleteResult(id) {
        try {
            const db = getDB();
            const collection = db.collection("results");

            await collection.deleteOne({ _id: new ObjectId(id) });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }
}
