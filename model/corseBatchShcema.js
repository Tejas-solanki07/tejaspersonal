const Joi = require('joi')
const mongoose = require('mongoose')

const RagularbatchSchema = mongoose.Schema({
    EventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'addCorseBatch'
    },
    
    StuName:{
        type:Array
    },
    isCompleted:{
        type:Boolean
    }
})

const coursebatchValidation = Joi.object({
    EventId: Joi.string().required(),
    StuName: Joi.array().min(1).required()
})


const courseBatchModel = mongoose.model('RagularbatchSchema',RagularbatchSchema)
module.exports={courseBatchModel,coursebatchValidation}