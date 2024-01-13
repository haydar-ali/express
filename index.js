const express = require('express')
const app = express()
const port = 4000;

const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

dotenv.config()
app.use(bodyParser.json())
app.use(cors());
//handle gambar
const multer = require('multer');
const path = require('path')

const fileStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'images')
    },
    filename: (req,file,cb) => {
        cb(null,new Date().getTime()+'-'+file.originalname)
    },
})
const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/png' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/jpeg'  ){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(multer({
    storage: fileStorage,
    fileFilter ,
}).single('gambar'))
const productRouter = require('./routes/product');
app.use('/api/v1/product', productRouter)

const authRouter = require('./routes/auth');
app.use('/api/v1/auth', authRouter)


mongoose.connect('mongodb+srv://eday:eday@cluster0.ufntjoe.mongodb.net/')
 .then(()=>{
    app.listen(port,()=>{
        console.log('ini express berjalan di http://localhost:' +port);
    })
 })
