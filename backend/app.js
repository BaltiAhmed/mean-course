const express = require('express')

const app = express()


app.use('/api/posts', (req, res, next) => {
    const posts = [
        { id: 'ghfghgdghs', title: 'first title', content: 'this is comming from the server' },
        { id: 'xjfhjfdb', title: 'second title', content: 'this is comming from the server' }
    ]
    res.status(200).json({message:'fetch successfully',posts:posts})
})


module.exports = app;