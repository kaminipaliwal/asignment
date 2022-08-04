const Users = require('../models/users');
var jwt = require('jsonwebtoken');
const secret = 'BHRTPO(TY&';

module.exports = (req, res, next) => {
     console.log("req->",req);
     var token = req.headers['authorization'];
     if(!token){
        res.status(401).send({message: "Unauthorise User"})
     }else {
        jwt.verify(token.split(" ")[1],secret, async(err, decode) => {
            if(err) return res.status(406).send({ message: 'Invalid Token.', err:err });
            let user = await Users.findById(decode['id']);
            if(!user) res.status(401).send({ message: "Unauthorise User"});
            if(user) req.authInfo = user;
            next();
        })
     }
}