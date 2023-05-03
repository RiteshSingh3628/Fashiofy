const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
// middleware for token checking
const requirelogin = require('../middleware/requirelogin')



// route for fetching all the posts from the database
router.get('/allposts',requirelogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort({$natural:-1})
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err)
    })
})
// route for fetching all the posts from the database
router.get('/followedposts',requirelogin,(req,res)=>{
    // if postedBy in following returns an array
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort({$natural:-1})
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err)
    })
})

// route for adding a post
router.post('/createpost',requirelogin,(req,res)=>{
    const {title,body,img} = req.body
    if(!title || !body || !img){
        return res.status(422).json({error:"Please add all the fields"})
    }

    req.user.password = undefined
    const post = new Post({
        title:title,
        body:body,
        photo:img,
        postedBy:req.user
    })
    post.save().then((result)=>{
        res.json({post:result})
    })
    .catch((err)=>{
        console.log(err)
    })
})

// router to fetch posts of the logged-In user
router.get('/mypost',requirelogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myposts=>{
        res.json({myposts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        // pushing data to array
        $push:{likes:req.user._id}

    },{
        // this returns the updated record
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .then((result)=>{
        return res.json(result)
    }).catch((err)=>{
        console.log("the error is.......",err)
        return res.status(422).json({error:err})
    })
})

router.put('/unlike',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        // pushing data to array
        $pull:{likes:req.user._id}

    },{
        // this returns the updated record
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .then((result)=>{
        res.json(result)
    }).catch((err)=>{
        console.log("the error is.......",err)
        return res.status(422).json({error:err})
    })
})
router.put('/comment',requirelogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        // pushing data to arrays
        $push:{comments:comment}

    },{
        // this returns the updated record
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    
    
    .then((result)=>{
        res.json(result)
    }).catch((err)=>{
        console.log("the error is.......",err)
        return res.status(422).json({error:err})
    })
})

router.delete('/deletePost/:postId',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then(result=>{
        if(result.postedBy._id.toString() === req.user._id.toString()){
            Post.deleteOne(result._id)
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
router.delete('/deleteComment/:postId',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    
    .populate("postedBy","_id")
    .then(result=>{
        console.log("user id ",req.user._id)
        for (const key in result.comments) {
            console.log(result.comments[key].postedBy)
            if(result.comments[key].postedBy.toString() === req.user._id.toString()){
                console.log('matched')
                Post.deleteOne(comments)
                .then(data=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
        
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
})


module.exports = router