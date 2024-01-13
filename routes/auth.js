const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const {register,login,logout,refresh_token} = require('../controllers/auth');
const {refresh_token} = require('../controllers/refreshToken');


router.post('/register',[
    body('nama').isLength({min:3}).withMessage("Nama Min 3 Char"),
    body('email').isLength({min:1,max:100}).withMessage("Email Min 10 Char"),
    body('password').isLength({min:1,max:100}).withMessage("password Min 10 Char"),
],register)
router.post('/login',[
    body('email').isLength({min:1,max:100}).withMessage("Email Min 10 Char"),
    body('password').isLength({min:1,max:100}).withMessage("password Min 10 Char")
    .custom(value => {
        if(!ValidatorsImpl.isAlphanumeric(value)){
            throw new Error('Password harus huruf dan angka')
        }
        return true 
    }),
],login)
router.delete('/logout',logout)
router.get('/token',refresh_token)


module.exports = router