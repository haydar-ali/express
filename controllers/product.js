const ProductPost = require('../models/product')
const {validationResult} = require('express-validator');
const fs = require('fs');

module.exports.add = (req,res)=> {
    const error = validationResult(req)

    if(!error.isEmpty()){
        const err = new Error('Invalid Value')
        err.errorStatus = 400
        err.data = error.array()
    }
    const {nama,harga,desc,stok} = req.body
    const gambar =  req.file.path 
    const ProductAdd = new ProductPost({
        nama, harga, desc,stok,gambar,
        status:1,
        proses:0
    })
    ProductAdd.save().then(result=>{
        res.status(201).json({
            message: "berhasil",
            code: 201,
            data:result
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal memanggil data',
            data: error.message
        })
    })
}

module.exports.list = (req,res)=> {
    ProductPost.find()
    .then(result => {
        res.status(200).json({
            message: 'berhasil memanggil data',
            data: result
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal memanggil data',
            data: error.message
        })
    })

}

module.exports.show = (req,res)=> {
    let productID = req.params.getId ;
    ProductPost.findById(productID)
    .then(result => {
        if(!result){
            res.status(400).json({
                message: 'Data Tidak ditemukan',
                data: result
            })
        }
        res.status(200).json({
            message: 'berhasil memanggil data',
            data: result
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal memanggil data',
            data: error.message
        })
    })
}
module.exports.edit = (req,res)=> {
    const error = validationResult(req)

    if(!error.isEmpty()){
        const err = new Error('Invalid Value')
        err.errorStatus = 400
        err.data = error.array()
    }
    let productID = req.params.getId ;
    const nama = req.body.nama 
    const harga = req.body.harga 
    const desc = req.body.desc 
    const stock = req.body.stock 
    const gambar = req.file.path

    ProductPost.findById(productID)
    .then(result => {
        // const update = result.data 
        if(gambar && fs.existsSync(result.gambar)){
            try {
                fs.unlinkSync(result.gambar);
                result.gambar = gambar
              } catch (error) {
                res.status(400).json({
                    message: 'gagal update data',
                    data: error.message
                })
              }
        }
        result.nama = nama
        result.harga = harga
        result.desc = desc
        result.stock = stock

        return result.save()

    })
    .then(up =>{
        res.status(200).json({
            message: 'berhasil update',
            data: up
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal update data',
            data: error.message
        })
    })
}
module.exports.destroy = (req,res)=> {
    let productID = req.params.getId ;
    ProductPost.findByIdAndDelete(productID)
    // ProductPost.deleteMany()

    .then(result => {
        if(!result){
            res.status(400).json({
                message: 'Data Tidak ditemukan',
                data: result
            })
        }
        try {
            fs.unlinkSync(result.gambar);
          
            console.log("Delete File successfully.");
          } catch (error) {
            console.log(error);
          }
        res.status(200).json({
            message: 'berhasil hapus data',
            data: null
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal menghapus data',
            data: error.message
        })
    })

}