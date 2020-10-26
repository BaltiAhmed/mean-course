const express = require('express')

const app = express()

app.use((req,res,next)=>{
    console.log('first middelware')
    next()
})


app.use((req,res,next)=>{
    res.send('hello from ahmed')
})


module.exports = app;