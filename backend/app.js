const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

const path = require("path")

const postsRoutes = require('./routes/posts')
const usersRoutes = require('./routes/user')


const { patch } = require('./routes/posts')


const app = express()

mongoose.connect("mongodb+srv://balti:test1@cluster0.88i0x.mongodb.net/mean?retryWrites=true&w=majority")
    .then(() => {
        console.log("connected to database")
    })
    .catch(() => {
        console.log("connection failed!")
    })

app.use(bodyParser.json())

app.use("/image",express.static(path.join("backend/images")))

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

app.use('/api/posts',postsRoutes)
app.use('/api/user',usersRoutes)




module.exports = app;