const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
// encrypting data
const bcrypt = require('bcrypt')
// token
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
// middleware for token checking
const requirelogin = require('../middleware/requirelogin')
// SMTP services
const nodemailer = require("nodemailer")



// function for sending email


// SIGNUP API
router.post('/signup',(req,resp)=>{
    // passing data from post
    const {name,email,password,pic} = req.body
    if(!email || !password || !name){
        // status 422 means server has understtod the request but cannot 
        // process the request
        // return will prevent from proceeding further
        return resp.status(422).json({error:"please add all the fields"})
    }
    // if user already exists throw error

    User.findOne({email:email})
    .then((userPresnt)=>{
        if(userPresnt){
            return resp.status(422).json({error:"User already exists with that email"})
        }
        else{
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    email:email,
                    password:hashedpassword,
                    name:name,
                    pic:pic
                })
                user.save()
                .then((user)=>{
                   
                    resp.json({message:"Created account successfully"})
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            
        }
        
    })
    .catch((err)=>{console.log(err)})
    
    
})


// SIGNIN API
router.post('/signin',(req,res)=>{    
    const{email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
                

                // if logged in then assign a token to the user
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token:token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch((err)=>{console.log(err)})
    })
})



module.exports = router