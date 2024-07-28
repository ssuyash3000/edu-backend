import { MongoClient } from "mongodb";
const url = process.env.DB_URL;

// const createCounter = async (db) => {
//   const exisitingCounter = await db
//     .collection("counters")
//     .findOne({ _id: "cartItemId" });
//   if (!exisitingCounter) {
//     await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
//   }
// };

const createIndexes = async (db) => {
    try {
        await db.collection("Notice").createIndex({ date: -1 });
        console.log("Indexes are created");
    } catch (err) {
        console.log(err);
    }
};
let client = null;
const connectToMongoDB = () => {
    MongoClient.connect(url)
        .then((clientInstance) => {
            client = clientInstance;
            //   createCounter(client.db());
            createIndexes(client.db());
            console.log("MongoDB is connected");
        })
        .catch((err) => {
            console.log(err);
        });
};
export const getClient = () => {
    return client;
};

export const getDB = () => {
    return client.db();
};
export default connectToMongoDB;
