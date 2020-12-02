module.exports = (req, res) => {
    var username = "";
    var password = "";
    const data = req.flash('data')[0]; // req.flash('data') returns an array with the data in the first element
    
    if (typeof data != "undefined") {
        username = data.username;
        password = data.password;
    }

    res.render('register', {
        //errors: req.session.validationErrors
        errors: req.flash('validationErrors'),
        username: username,
        password: password
    });
};