export const auth = (req, res, next) => {
    if (req.session.userEmail) {
        //if session id exist then call next middleware in the
        //pipeline
        next();
    } else {
        res.render("login", {
            errorMessage: "You need to login to gain admin access",
            userEmail: req.session.userEmail,
        });
    }
};
