const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config()

const { addBatch, updateBatch, deleteBatch, displayBatch ,completedBatch,displayCompletedBatch} = require('../controller/corseBatchController')

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

route.post('/addbatch',isAuth, addBatch)
route.post('/Update',isAuth, updateBatch)
route.delete('/Delete',isAuth, deleteBatch)
route.get('/Display',isAuth, displayBatch)
route.post('/isCompleted',isAuth,completedBatch)
route.get('/displaycompleted',isAuth,displayCompletedBatch)



module.exports = route