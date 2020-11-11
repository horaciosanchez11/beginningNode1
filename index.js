const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');

const app = new express();
const customMiddleware = (req, res, next) => {
    console.log('Custom middleware was called!');
    next();
};

// chapter 8
/*const validateMiddleware = (req, res, next) => {
    if (req.files == null || req.body.title == null || req.body.username == null) {
        return res.redirect('/posts/new');
    }
    next();
};*/

// chapter 9
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const validateMiddleware = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const logoutController = require('./controllers/logout');

global.loggedIn = null;

app.use(express.static('public'));
app.use(customMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use('/posts/store', validateMiddleware); // added on chapter 8
app.set('view engine', 'ejs');
app.use(expressSession({
    secret: 'keyboard cat'
}));
app.use('*', (req, res, next) => {
    loggedIn = req.session.userId;
    next();
})

app.listen(4000, () => {
    console.log('App listening on port 4000');
});

/*app.get('/', async (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'pages/index.html'));
    
    // with EJS:
    //res.render('index'); // will look in a 'views' folder for file index.ejs

    const blogposts = await BlogPost.find({});
    console.log(blogposts);
    res.render('index', {
        blogposts: blogposts
    });
});*/
app.get('/', homeController);

/*app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/post', (req, res) => {
    res.render('post');
});*/

/*app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id);
    res.render('post', {
        blogpost
    });
});*/
app.get('/post/:id', getPostController);

/*app.get('/posts/new', (req, res) => {
    //res.render('create');
    
});*/
app.get('/posts/new', authMiddleware, newPostController);

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

/*app.post('/posts/store', (req, res) => {
    console.log(req.body);
    BlogPost.create(req.body,(error, blogpost) => {
        res.redirect('/');
    });
});*/
/*app.post('/posts/store', (req, res) => {
    console.log(req.body);
    let image = req.files.image;
    image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        });
        res.redirect('/');
    });
});*/
app.post('/posts/store', authMiddleware, storePostController);

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/auth/logout', logoutController);

app.use((req, res) => {
    res.render('notfound');
})

// takes in parameter host and database name
mongoose.connect('mongodb://localhost/my_database',{useNewUrlParser:true});