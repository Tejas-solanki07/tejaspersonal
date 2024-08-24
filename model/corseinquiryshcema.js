
const mongoose = require('mongoose')
const joi = require('joi')

const corseInquiry = mongoose.Schema({
    
    
    FullName: {
        type: String
    },
    Contact: {
        type: Number
    },
    Email: {
        type: String
    },
    Date: {
        type: Date
    },
    Description: {
        type: String
    },
    CollageName: {
        type: String
    },
    Course: {
        type: Array
    },
    Testarr: {
        type: Array
    },
    onGoing: {
        type: Boolean
    },
    Reject: {
        type: Boolean
    },
    Confirm: {
        type: Boolean
    },
    Interaction: {
        type: String
    },
    FollowUp: {
        type: String
    },
    isDeleted: {
        type: Boolean
    },
    isAdded: {
        type: Boolean
    },
    stuAddedArr:{
        type: Array
    }

})

const validation = joi.object({
    FullName: joi.string()
        
        .min(3)
        .max(30)
        .required(),

    Contact: joi.number()
    .min(1000000000)
    .message("Phone Number Must Be 10 Digit")  
    .max(9999999999)
        .required(),

    Email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    Date: joi.date().required(),

    
    
    CollageName: joi.string()
    .required(),
    
    Course: joi.array().min(1)
    .required(),
    
    FollowUp: joi.string()
    .required(),
    Interaction: joi.string()
    .required(),
    
    Description: joi.string()
        .required()
})

const CourseInquirymodel = mongoose.model('corseInquiry', corseInquiry)
module.exports = {  CourseInquirymodel,validation }