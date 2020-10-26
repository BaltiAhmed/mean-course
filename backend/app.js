const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

const Post = require('./models/post')

const app = express()

mongoose.connect("mongodb+srv://balti:test1@cluster0.88i0x.mongodb.net/mean?retryWrites=true&w=majority")
    .then(() => {
        console.log("connected to database")
    })
    .catch(() => {
        console.log("connection failed!")
    })

app.use(bodyParser.json())

app.use(function (req, res, next) {
    /*var err = new Error('Not Found');
     err.status = 404;
     next(err);*/

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

    //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Pass to next layer of middleware
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    res.status(201).json({ message: 'post added' })
})

app.get('/api/posts', (req, res, next) => {
    Post.find().then((documents) => {
        res.status(200).json({ message: 'post deleted'})

    })
})

app.delete('/api/posts/:id',(req,res,next)=>{
    console.log(req.params.id)
    res.status(200).json({ message: 'fetch successfully', posts: documents })

})


module.exports = app;