const config = require('./config')
const jwt  = require('jsonwebtoken')

function verifyjwt(req,res,next){
     const token = req.headers['authorization']
     console.log("hjebdkjjkncklw",token);
    const tokenWithoutBearerin = token.replace("Bearer ", "");
    if(!token) return res.status(401).json('Unauthorize user')
   try{
         jwt.verify(tokenWithoutBearerin,config.secret,function(err,decode){
          if(err){
               res.status(401).json( {message:'Token not valid', error:err})
          } else{
               req.user = decode
               next()
          }
        });
     
   }catch(e){
     res.status(400).json( {message:'Token not valid'})
   }
}

module.exports=verifyjwt