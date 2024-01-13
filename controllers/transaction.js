const Transaction = require('../models/transaction')


module.exports.add = (req,res)=> {
    let {userRes,wishlist,cart,buy} = req.body ;
    const TransactionAdd = new Transaction({
        userRes,wishlist,cart,buy
    })
    TransactionAdd.save().then(result=>{
        res.status(201).json({
            message: "berhasil",
            code: 201,
            data:result
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal insert data',
            data: error.message
        })
    })
}

module.exports.dataCart = (req,res)=> {
    Transaction.find()
    .then(result => {
        res.status(200).json({
            message: 'berhasil memanggil data cart',
            data: result.cart
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal memanggil data cart',
            data: error.message
        })
    })
}
module.exports.dataWishlist = (req,res)=> {
    Transaction.find()
    .then(result => {
        res.status(200).json({
            message: 'berhasil memanggil data wishlist',
            data: result.wishlist
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal memanggil data wishlist',
            data: error.message
        })
    })
}
module.exports.dataBuy = (req,res)=> {
    Transaction.find()
    .then(result => {
        res.status(200).json({
            message: 'berhasil memanggil data buy',
            data: result.buy
        })
    })
    .catch(error => {
        res.status(400).json({
            message: 'gagal memanggil data buy',
            data: error.message
        })
    })
}

module.exports.show = (req,res)=> {
    let transactionId = req.params.getId ;
    Transaction.findById(transactionId)
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
    let transactionID = req.params.getId ;
    const userRes = req.body.userRes 
    const wishlist = req.body.wishlist 
    const cart = req.body.cart 
    const buy = req.body.buy 
    Transaction.findById(transactionID)
    .then(result => {
        // const update = result.data 
        result.userRes = userRes
        result.wishlist = wishlist
        result.cart = cart
        result.buy = buy

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