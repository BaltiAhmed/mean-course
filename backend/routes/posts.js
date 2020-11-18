const express = require('express');
const { model } = require('../models/post');
const multer = require('multer')

const route = express.Router()


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const Post = require('../models/post');
const { count } = require('console');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("inavalid type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});




route.post('', multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/image/" + req.file.filename,
        creator:req.body.creator
    });
    post.save().then(createdPost => {
        res.status(201).json({ message: 'post added', post: { ...createdPost, id: createdPost._id } })

    })

})

route.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
    }
    postQuery.find().then((documents) => {
        fetchedPost = documents;
        return Post.count();

    }).then(count => {
        res.status(200).json({ message: 'fetch successfully', posts: fetchedPost, maxPosts: count })
    })
})

route.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "post does't exist!!" })
        }
    })
})

route.delete('/:id/:creator', (req, res, next) => {
    
    Post.deleteOne({ _id: req.params.id, creator:req.params.creator }).then(result => {
        
        res.status(200).json({ message: 'post deleted' })
    })

})

route.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/image/" + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator:req.body.creator
    })
    Post.updateOne({ _id: req.params.id , creator:req.body.creator}, post).then(result => {
        res.status(200).json({ message: 'post updated' })
    })
})

module.exports = route