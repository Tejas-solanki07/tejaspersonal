const express=require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config()

const {addBatchEvent,updatBatchEvent,allcourse,deleteBatchEvent,getAllData,postiscompleted,getiscompleted}=require('../controller/addCorseController')

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

route.post('/addBevent',isAuth, addBatchEvent)
route.post('/UpdateBevent',isAuth, updatBatchEvent)
route.delete('/DeleteBevent',isAuth, deleteBatchEvent)
route.get('/DisplayBevent',isAuth, getAllData)
route.post('/completedBevent',isAuth,postiscompleted)
route.get('/displaycompletedBevent',isAuth,getiscompleted)
route.get('/allcourse',isAuth,allcourse)


module.exports=route