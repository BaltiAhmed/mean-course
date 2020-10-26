const express = require('express')
const bodyParser = require('body-parser')

const app = express()
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
    const post = req.body
    console.log(post)
    res.status(201).json({ message: 'post added' })
})

app.get('/api/posts', (req, res, next) => {
    const posts = [
        { id: 'ghfghgdghs', title: 'first title', content: 'this is comming from the server' },
        { id: 'xjfhjfdb', title: 'second title', content: 'this is comming from the server' }
    ]
    res.status(200).json({ message: 'fetch successfully', posts: posts })
})


module.exports = app;