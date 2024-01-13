const AuthUser = require('../models/auth')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator');


module.exports.refreshToken = (req,res)=> {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
        return res.sendStatus(404)
    }    
    AuthUser.findOne({
        refresh_token:refreshToken
    }).then(result =>{
        if(!result){
            return res.sendStatus(404)
        }
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decode)=>{
            if(err){
                return res.sendStatus(403)
            }
            const id = result._id
            const nama = result.nama
            const email = result.email

            const accessToken = jwt.sign({id,nama,email},process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1d'
            })
            res.json({accessToken})
        })
    })
}