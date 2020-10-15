module.exports = (req, res, next) => {
    if (req.files == null || req.body.title == null || req.body.username == null) {
        return res.redirect('/posts/new');
    }
    next();
}