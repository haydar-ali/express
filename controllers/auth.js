const AuthUser = require('../models/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator');
const { response } = require('express');

module.exports.register = (req,res)=> {
    const error = validationResult(req)
    const {nama,email,password,repassword} = req.body
    if(password != repassword){
        return res.status(400).json({
            message: "Password dan Konfirmasi Tidak Sama"
        })
    }
    AuthUser.findOne({email:email}).then(result =>{
        if(result){
            return res.status(400).json({
                message: "Email sudah terdaftar"
            })
        }
        bcrypt.genSalt()
        .then(salt=>{
            bcrypt.hash(password,salt)
            .then(hashpw => {
                const regAuth = new AuthUser({
                    nama,email,
                    password:hashpw,
                    refresh_token:null
                })
                return regAuth.save()
            })
            .then(final => {
                res.status(200).json({
                    message:"Berhasil Registrasi",
                    data:{
                        nama,email
                    }
                })
            })
            .catch(error=>{
                return res.status(400).json({
                    message: "Gagal Registrasi",
                    data: error
                })
            })
        })

    })
}

module.exports.login = (req,res)=> {
    const {email,password} = req.body
    AuthUser.findOne({email:email}).then(result =>{
        // console.log(process.env.ACCESS_TOKEN_SECRET)
        if(!result){
            return res.status(400).json({
                message: "Email tidak terdaftar"
            })
        }
        bcrypt.compare(password,result.password)
            .then(match => {
                if(!match){
                    return res.status(400).json({
                        message: "Email dan Password tidak sama"
                    })
                }
                const id = result._id ;
                const nama = result.nama ;
                const email = result.email ;
                
                const accessToken = jwt.sign(
                   { id,nama,email}
                ,process.env.ACCESS_TOKEN_SECRET,{
                    expiresIn: '1d'
                })
                const refreshToken = jwt.sign(
                    {id,nama,email}
                ,process.env.REFRESH_TOKEN_SECRET,{
                    expiresIn: '1d'
                })

                AuthUser.updateOne({id:id},{$set: {refresh_token:refreshToken}})
                    .then(()=>{
                        res.cookie('refreshToken',refreshToken,{
                            httpOnly:true,
                            maxAge : 24 * 60 * 60 * 1000,
                            secure : true,
                            sameSite: "none"
                        })
                        res.status(201).json({
                            message: "Berhasil Login",
                            accessToken
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            message: "Gagal Login",
                            data: err
                        })
                    })
            })
    })
}

module.exports.logout = (req,res)=> {
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
        const id = result._id 

        AuthUser.updateOne({_id:id},{$set:{refresh_token:null}})
        .then(()=>{
            res.clearCookies('refreshToken')
            res.status(200).json({message:"Berhasil"})
        })
    })
}