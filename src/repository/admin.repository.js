import { getDB } from "../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";
class AdminRepository {
    async findByEmail(email) {
        // 1. Get the database
        const db = getDB();
        // 2. Get the collection
        const collection = db.collection("Admins");

        // 3. Find the Admin in the collection
        try {
            return await collection.findOne({ email });
        } catch (err) {
            throw new ApplicationError("Something went wrong", 503);
        }
    }
    async signUp(newAdmin) {
        // 1. Get the database
        const db = getDB();
        // 2. Get the collection
        const collection = db.collection("Admins");

        // 3. Insert the Admin into the collection
        try {
            await collection.insertOne(newAdmin);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 503);
        }
        //Admins.push(newAdmin);
        return newAdmin;
    }

    // async SignIn(email, password) {
    //   // 1. Get the database
    //   const db = getDB();
    //   // 2. Get the collection
    //   const collection = db.collection("Admins");

    //   // 3. Find the Admin in the collection
    //   try {
    //     return await collection.findOne({ email, password });
    //   } catch (err) {
    //     throw new ApplicationError("Something went wrong", 503);
    //   }
    // }
}
export default AdminRepository;
