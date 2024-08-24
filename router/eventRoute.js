const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config()

const { addevent, updateevent, deleteevent, getAllData ,eventComleted,getComletedevent,getAllevent,getAllWorkshop} = require('../controller/eventController')
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

route.post('/addevent',isAuth, addevent)
route.post('/Updateevent',isAuth, updateevent)
route.delete('/Deleteevent',isAuth, deleteevent)
route.get('/Displayevent',isAuth, getAllData)
route.post('/Completed',isAuth,eventComleted)
route.get('/Completedevent',isAuth,getComletedevent)
route.get('/Allevent',isAuth,getAllevent)
route.get('/AllWorkshop',isAuth,getAllWorkshop)


module.exports = route