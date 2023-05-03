const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin = require('../middleware/requirelogin')

const Blog = mongoose.model('Blog')

router.get('/allblogs',requirelogin,(req,res)=>{
    Blog.find()
    .populate("postedBy", "id name pic")
    .sort({$natural:-1})
    .then(post=>{
        res.json({post})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

router.post('/addblog',requirelogin,(req,res)=>{
    const {title,body,img} = req.body
    if(!title || !body || !img){
        return res.status(422).json({error:"Add all the fields"})
    }
    
    req.user.password = undefined
    const blog = new Blog({
        title:title,
        body:body,
        photo:img,
        postedBy:req.user
    })
    blog.save()
    .then(result=>{
        res.json({blog:result})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.delete('/deleteBlog/:blogId',requirelogin,(req,res)=>{
    Blog.findOne({_id:req.params.blogId})
    .populate("postedBy","_id")
    .then(result=>{
        if(result.postedBy._id.toString() === req.user._id.toString()){
            console.log(req.user._id.toString(),result.postedBy._id.toString())
            Blog.deleteOne(result._id)
            .then(data=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
})

module.exports = router