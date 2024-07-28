import fs from "fs";
import winston from "winston";

const fsPromise = fs.promises;
// Earlier we had used callbacks
// to asynchronously write in the
// file, here we will be using Promises

export async function log(logData) {
    try {
        await fsPromise.appendFile("error-log.txt", logData);
    } catch (err) {
        console.log(err);
    }
}
//Creating winston logger
const winstonLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "request-logging" },
    transports: [new winston.transports.File({ filename: "log.txt" })],
});
const loggerMiddleware = (req, res, next) => {
    if (!req.url.includes("login")) {
        let logData = `\n${new Date().toString()} \nreq.body = ${JSON.stringify(
            req.body
        )}\nreq.url = ${req.url}`;
        //log(logData);
        winstonLogger.info(logData);
    }
    next();
};

export default loggerMiddleware;
