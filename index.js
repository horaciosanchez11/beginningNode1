const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const BlogPost = require('./models/BlogPost.js');

const app = new express();
const customMiddleware = (req, res, next) => {
    console.log('Custom middleware was called!');
    next();
};

// chapter 8
const validateMiddleware = (req, res, next) => {
    if (req.files == null || req.body.title == null || req.body.username == null) {
        return res.redirect('/posts/new');
    }
    next();
};

app.use(express.static('public'));
app.use(customMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use('/posts/store', validateMiddleware); // added on chapter 8
app.set('view engine', 'ejs');

app.listen(4000, () => {
    console.log('App listening on port 4000');
});

app.get('/', async (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'pages/index.html'));
    
    // with EJS:
    //res.render('index'); // will look in a 'views' folder for file index.ejs

    const blogposts = await BlogPost.find({});
    console.log(blogposts);
    res.render('index', {
        blogposts: blogposts
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

/*app.get('/post', (req, res) => {
    res.render('post');
});*/
app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id);
    res.render('post', {
        blogpost
    });
});

app.get('/posts/new', (req, res) => {
    res.render('create');
});

/*app.post('/posts/store', (req, res) => {
    console.log(req.body);
    BlogPost.create(req.body,(error, blogpost) => {
        res.redirect('/');
    });
});*/
app.post('/posts/store', (req, res) => {
    console.log(req.body);
    let image = req.files.image;
    image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        });
        res.redirect('/');
    });
});

// takes in parameter host and database name
mongoose.connect('mongodb://localhost/my_database',{useNewUrlParser:true});