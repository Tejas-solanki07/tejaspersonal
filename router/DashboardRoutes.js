const express=require("express")
const jwt = require('jsonwebtoken')
const Route=express.Router()
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
const {CourseData,StudentDetails,EventStudentDetails}=require("../controller/DashboardController")
Route.get("/CourseData",isAuth,CourseData)
Route.get("/StudentDetails",isAuth,StudentDetails)
Route.get("/EventStudentDetails",isAuth,EventStudentDetails)


module.exports=Route