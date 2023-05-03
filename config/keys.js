
// if are on the production site we will export prod file otherwise send dev file
if(process.env.NODE_ENV==="production"){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}