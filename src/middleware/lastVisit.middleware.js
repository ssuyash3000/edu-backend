export const setLastVisit = (req, res, next) => {
    // Only if cookie is set, then add a
    // local variable with last time data
    if (req.cookies.lastVisit) {
        res.locals.lastVisit = new Date(req.cookies.lastVisit).toLocaleString(
            "en-GB",
            { timeZone: "Asia/Kolkata" }
        );
    }
    res.cookie("lastVisit", new Date().toISOString(), {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        //converting 2 days in miliseconds
    });
    next(); //calling next middleware in pipeline
};
