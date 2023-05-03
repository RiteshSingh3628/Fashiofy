const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
// middleware for token checking
const requirelogin = require('../middleware/requirelogin')

router.get('/user/:id',requirelogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    
    .select("-password")
    .then((user)=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .then(posts=>{
            res.json({user,posts})
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{$push:{followers:req.user._id}},{new:true})
    .then(result=>{
        User.findByIdAndUpdate(req.user._id,{$push:{following:req.body.followId}},{new:true}).select("-password")
        .then(result2=>{
            return res.json(result2)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
    

})

router.put('/unfollow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{$pull:{followers:req.user._id}},{ new:true})
    .then(result=>{
      
        User.findByIdAndUpdate(req.user._id,{$pull:{following:req.body.unfollowId}},{new:true}).select("-password")
        .then(result2=>{
            return res.json(result2)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })

})


router.put("/updatepic",requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {$set:{pic:req.body.pic}},
        {new:true}
    )
    .then(result=>{
        return res.json({result})
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.post('/serach-users',(req,res)=>{
    let UserPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:UserPattern}})
    .select("_id email name pic")
    .then(user=>{
        res.json({user:user})
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router