const mongoose = require('mongoose');
const BlogSpot = require('./models/BlogPost');

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser:true});

BlogSpot.create({
    title: 'The Mythbusters Guide to Saving Money on Energy Bills',
    body: 'If you have been here a long time, you might remember when I went on ITV Tonight to dispense a masterclass...'
}, (error, blogspot) => {
    console.log(error, blogspot);
})