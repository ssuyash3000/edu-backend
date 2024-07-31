import "./env.js";
import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import ejsLayouts from "express-ejs-layouts";
import connectToMongoDB from "./src/config/mongodb.js";
import { auth } from "./src/middleware/auth.middleware.js";
import AdminController from "./src/controller/admin.controller.js";
import loggerMiddleware, { log } from "./src/middleware/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
// import { error, log } from "console";

import NoticeController from "./src/controller/notice.controller.js";
import { uploadFile } from "./src/middleware/file-upload.middleware.js";
import cors from "cors";
import ResultController from "./src/controller/result.controller.js";
import { uploadResultFile } from "./src/middleware/uploadResult.middleware.js";
const port = process.env.PORT || 3001;

const server = express();
server.use(cors());
server.use(cookieParser());
console.log(process.env.SecretKeyForSession);
server.use(
    session({
        secret: process.env.SecretKeyForSession,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
//parse form data
server.use(express.urlencoded({ extended: true }));

// setup view engine settings
server.set("view engine", "ejs");
// path of our views
const pathOfviews = path.join(path.resolve(), "src", "views");
server.set("views", pathOfviews);
//setting layout
server.use(ejsLayouts);

server.use((err, req, res, next) => {
    console.log("Error:", err);
    log(JSON.stringify(err));
    if (err instanceof ApplicationError) {
        console.log("ApplicationError:", err);
        res.status(err.code).render("not-found", {
            errorCode: err.code,
            errorMessage: err.message,
            userEmail: req.session.userEmail,
        });
    } else {
        console.log("General Error:", err);
        res.status(500).render("not-found", {
            errorCode: 500,
            errorMessage: "Something went wrong",
        });
    }
});
server.use(loggerMiddleware);
server.get("/admin", auth, (req, res) => {
    res.render("homepage", {
        userEmail: req.session.userEmail,
    });
    // res.send("server is setup");
});
server.use(express.static("build"));
server.get("/", (req, res) => {
    res.render("build/index.html");
});
//admin password - uC=_^918;}f,
const adminController = new AdminController();
// server.get("/admin/register", (req, res) => {
//     res.render("register");
// });
// server.post("/admin/register", (req, res) => {
//     adminController.postRegister(req, res);
// });
server.get("/admin/login", (req, res) => {
    res.render("login", {
        errorMessage: null,
        userEmail: req.session.userEmail,
    });
});
server.post("/admin/login", (req, res) => {
    adminController.postLogin(req, res);
});
server.get("/admin/logout", adminController.logout);

//////// Notice Related Routes ////////
let noticeController = new NoticeController();

server.get("/api/recent-notice-list", noticeController.getRecentNoticeList);

server.get("/admin/getNoticeList", auth, noticeController.getNoticeList);
server.post(
    "/admin/delete-notice/:id/:start/:end/:path",
    auth,
    noticeController.deleteNotice
);
server.get("/admin/add-notice", auth, noticeController.getNoticeForm);
server.post(
    "/admin/add-notice",
    auth,
    uploadFile.single("noticeFile"),
    noticeController.postNotice
);
// server.use(express.static("notice"));

////////////// Result Related Feature ////////////////
let resultController = new ResultController();
server.get("/admin/upload-results", auth, (req, res, next) => {
    res.status(200).render("Add Result");
});
server.post(
    "/admin/upload-results",
    auth,
    uploadResultFile.single("resultFile"),
    (req, res, next) => {
        // res.render("Add Result");
        resultController.uploadResults(req, res, next);
    }
);
// server.get("/admin/view-result/:id", (req, res, next) => {
//     resultController.getResultView(req, res, next);
// });

server.get("/admin/view-results", auth, (req, res, next) => {
    resultController.viewResultAdmin(req, res, next);
});

server.post("/admin/delete-result/:id/:start/:end", auth, (req, res, next) => {
    resultController.deleteResult(req, res, next);
});

server.get("/get-result/:id", (req, res, next) => {
    resultController.getResultView(req, res, next);
});
server.get("/api/view-results", (req, res, next) => {
    resultController.viewResultsAPI(req, res, next);
    // res.render("Result List", {
    //     results: [],
    // });
});
server.get("/view-results", (req, res, next) => {
    resultController.viewResults(req, res, next);
    // res.render("Result List", {
    //     results: [],
    // });
});
server.use(express.static("public"));
server.use("/", (req, res) => {
    res.status(404).render("not-found", {
        errorMessage: "This path does not exists",
        errorCode: 404,
        userEmail: req.session.userEmail,
    });
});
server.use(express.static("src/views"));

server.use(loggerMiddleware);

server.listen(port, () => {
    connectToMongoDB();
    console.log(`Server has started at port ${port}`);
});
