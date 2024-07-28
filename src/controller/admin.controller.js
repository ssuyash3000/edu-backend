import { AdminModel } from "../model/admin.model.js";
import bcrypt from "bcrypt";

import AdminRepository from "../repository/admin.repository.js";
import { ApplicationError } from "../error-handler/applicationError.js";

export default class AdminController {
    constructor() {
        // this.userRepsitory = new UserRepository();
        this.adminRepository = new AdminRepository();
    }
    getRegister(req, res) {
        res.render("register", { userEmail: req.session.userEmail });
    }
    getLogin(req, res) {
        res.render("login", {
            errorMessage: null,
            userEmail: req.session.userEmail,
        });
    }
    async postRegister(req, res) {
        const { name, email, password } = req.body;
        // UserModel.add(name, email, password);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new AdminModel(name, email, hashedPassword);
        const result = await this.adminRepository.signUp(newUser);

        // res.render("login", { errorMessage: null });
        res.redirect("/admin/login");
    }
    async postLogin(req, res) {
        try {
            let { email, password } = req.body;
            // console.log(email);
            const user = await this.adminRepository.findByEmail(email);
            if (!user) {
                res.render("login", {
                    errorMessage:
                        "User with given email and password not found",
                    userEmail: req.session.userEmail,
                });
            } else {
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    //console.log("from user controller ", user._id.toString());
                    // 1. Create our token on successful login
                    // const token = jwt.sign(
                    //   { userId: user._id.toString(), email: user.email },
                    //   process.env.JWT_SECRET,
                    //   {
                    //     expiresIn: "1h",
                    //   }
                    // );
                    // // 2. Send the token
                    // res.status(200).send(token);

                    req.session.userEmail = email;
                    console.log(req.session.userEmail);
                    res.redirect("/admin");
                } else {
                    res.render("login", {
                        errorMessage:
                            "User with given email and password not found",
                        userEmail: req.session.userEmail,
                    });
                }
            }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something wrong with database", 503);
        }
    }
    logout(req, res) {
        //on logout, destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/admin/login");
            }
        });
        res.clearCookie("lastVisit");
        // res.redirect("/");
    }
}
