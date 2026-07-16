module.exports.isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash("error", "You must be logged in to access this page.");
    res.redirect("/login");
};

module.exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    req.flash("error", "Access Denied. You do not have admin privileges.");
    res.redirect("/");
};
