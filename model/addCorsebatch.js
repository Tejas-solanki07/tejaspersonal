const mongoose = require('mongoose')
const joi = require('joi')

const addCorseBatch=mongoose.Schema({
    StartDate:{
        type:Date
    },
   
    Course:{
        type:String
    },
    batchName:{
        type:String
    },
    BatchTime:{
        type:Date
    },
    Days:{
        type:Array
    },
  
  
    IsCompleted:{
        type:Boolean
    }
})

const validation = joi.object({
    Course:joi.string().required(),
    StartDate:joi.date().required(),
    Days:joi.array().min(1).required(),
BatchTime:joi.date().required(),
batchName:joi.string().required()
})

const AddCourseModel = mongoose.model("addCorseBatch",addCorseBatch)
module.exports={validation,AddCourseModel}