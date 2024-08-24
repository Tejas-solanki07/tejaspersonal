const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config()

const { addEventInquiry,
    updateEventinquiry,
    deletEventinquiry,
    displayConfirmEventInquiry,
    displayAllEventInquiry,
    displayOnGoingEventInquiry,
    displayRejectEventInquiry,
    RejectEventInquiry,
    ConfirmEventInquiry,
    eventIsAdded,
    getISAddeddata,
    hardelet,
    commonSearch,
    filterByMonth,
    sortBykey,
    Alldata
     } = require('../controller/eventInquiryController')

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

route.post('/addInquiry',isAuth, addEventInquiry)
route.post('/Update',isAuth, updateEventinquiry)
route.delete('/hardDelete',isAuth, hardelet)
route.delete('/Delete',isAuth, deletEventinquiry)
route.get('/Display',isAuth, displayAllEventInquiry)
route.get('/OnGoing',isAuth, displayOnGoingEventInquiry)
route.get('/Reject',isAuth, displayRejectEventInquiry)
route.get('/Confirm',isAuth, displayConfirmEventInquiry)
route.post('/RejectedInquiry',isAuth, RejectEventInquiry)
route.post('/ConfimInquiry',isAuth, ConfirmEventInquiry)
route.post('/isAdded',isAuth,eventIsAdded)
route.get('/getisAdded',isAuth,getISAddeddata)
route.get('/sortby',isAuth,sortBykey)
route.get('/filterbyMonth',isAuth,filterByMonth)
route.get('/search',isAuth,commonSearch)
route.get('/alldata',isAuth,Alldata)



module.exports = route