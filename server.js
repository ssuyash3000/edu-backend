import "./env.js";
import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import ejsLayouts from "express-ejs-layouts";
import connectToMongoDB from "./src/config/mongodb.js";
import { auth } from "./src/middleware/auth.middleware.js";
import AdminController from "./src/controller/admin.controller.js";
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { error, log } from "console";

const port = process.env.PORT || 3001;

const server = express();

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
server.use("/", (req, res) => {
    res.status(404).render("not-found", {
        errorMessage: "This path does not exists",
        errorCode: 404,
        userEmail: req.session.userEmail,
    });
});
//////// Notice Related Routes ////////






















server.use(express.static("src/views"));
server.use(express.static("public"));
server.use(loggerMiddleware);

server.listen(port, () => {
    connectToMongoDB();
    console.log(`Server has started at port ${port}`);
});