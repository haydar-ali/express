const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const {add,list,show,destroy,edit} = require('../controllers/product');


router.get('/data',list)
router.get('/show/:getId',show)
router.delete('/delete/:getId',destroy)

router.post('/create',[
    body('nama').isLength({min:3}).withMessage("Nama Product Min 3 Char"),
    body('desc').isLength({min:10,max:100}).withMessage("Descripsi Product Min 10 Char")
],add)
router.put('/edit/:getId',[
    body('nama').isLength({min:3}).withMessage("Nama Product Min 3 Char"),
    body('desc').isLength({min:10,max:100}).withMessage("Descripsi Product Min 10 Char"),
],edit)



module.exports = router