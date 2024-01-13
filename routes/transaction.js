const express = require('express');
const router = express.Router();
const {add,dataCart,dataWishlist,dataBuy,show,edit} = require('../controllers/transaction');


router.get('/dataCart',dataCart)
router.get('/dataWishlist',dataWishlist)
router.get('/dataBuy',dataBuy)

router.get('/show/:getId',show)
router.post('/create',add)
router.put('/edit/:getId',edit)

module.exports = router