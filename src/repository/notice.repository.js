import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";
//import { ApplicationError } from "../errors/ApplicationError.js";
import path from "path";
// import { dirname } from "path";
import fs from "fs";
export class NoticeRepository {
    async addNewNotice(noticeObj) {
        const db = getDB();
        const collection = db.collection("Notice");
        try {
            await collection.insertOne(noticeObj);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }

    async getRecentNoticeList() {
        const db = getDB();
        const collection = db.collection("Notice");
        try {
            const notices = await collection
                .find()
                .sort({ date: -1 })
                .limit(10)
                .toArray();
            return notices;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }

    async getNoticeList(start = 1, end = 10) {
        const db = getDB();
        const collection = db.collection("Notice");
        try {
            const skipCount = start - 1; // Convert start to zero-based index
            const limitCount = end - start + 1;
            const notices = await collection
                .find()
                .sort({ date: -1 })
                .skip(skipCount)
                .limit(limitCount)
                .toArray();
            return notices;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }
    async deleteNoticeById(id, pathofFile) {
        console.log(pathofFile);
        const db = getDB();
        const collection = db.collection("Notice");
        const filePath = path.join("public", `${pathofFile}`);
        console.log(filePath);
        try {
            const result = await collection.deleteOne({
                _id: new ObjectId(id),
            });
            if (result.deletedCount === 0) {
                throw new ApplicationError("Notice not found", 404);
            }

            // Delete the file from the file system
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                    // Optionally, you can handle the error more gracefully here
                } else {
                    console.log("File deleted successfully");
                }
            });

            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
    }
}
