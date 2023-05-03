module.exports={
    // '@' symbol of password is decoded as %40 bcz '@' will give an error
    MONGOURI:process.env.MONGOURI,
    JWT_SECRET:process.env.JWT_SEC
}