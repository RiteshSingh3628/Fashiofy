const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
// importing mongo DB URI from keys.js
const {MONGOURI} = require('./config/keys')







// establishing connection with database
mongoose.connect(MONGOURI).then(()=>{
    console.log("connection successful.......");
}).catch((err)=>{console.log("Unable to connect due to..",err)})

// =====SCHEMAS================
// importing user schema
require('./models/user')
// importing userpost schema
require('./models/userpost')
// importing user blog schema
require('./models/blogpost')

// its a middleware which parse the incoming request into json
app.use(express.json())
// ==========DIFFERENT ROUTES==========
// autantication router
app.use(require('./routes/auth'))
// post router
app.use(require('./routes/post'))
// user router
app.use(require('./routes/user'))
// // blog route
app.use(require('./routes/blog'))


// // if we are running on the production side these condition will be applied
// if(process.env.NODE_ENV == "production"){
//     // serving the static file
//     app.use(express.static('clients/build'))
//     const path = require('path')
//     // if the clent is requesting any file we will send these below files
//     app.get("*",(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'clients','build','index.html'))
//     })
// }


app.listen(PORT,()=>{
    console.log("Server is running on ",PORT)
})