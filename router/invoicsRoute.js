const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config()

const { addInvoice, updateinvoice,search,courseInvoice, displayInvoice,pdfmail,fillterbyDate,filterByMonth} = require('../controller/invoiceContrller')

const isAuth=(req,res,next)=>{
    let token = req.headers.authorization.split(' ')[1]
    console.log(req.headers)
    try{
     let chek =jwt.verify(token,process.env.JWT_SECRET_KEY)
    if (chek) {
     next()
    }
    else{
     res.send({msg:'jwt not found'})
    }
   
    }
    catch(err){
     res.send({err:err})
    }
    
 }

route.post('/addinfo',isAuth, addInvoice)
route.post('/Update',isAuth, updateinvoice)
// route.post('/Delete',isAuth, deletinvoice)
route.get('/Display',isAuth, displayInvoice)
route.post('/pdf',isAuth,pdfmail)
route.get('/filterinvocedate',isAuth, fillterbyDate)
route.get('/fillterinvocemonth',isAuth, filterByMonth)
route.get('/searchinstu',isAuth, search)
route.get('/courseIn',isAuth, courseInvoice)



module.exports = route