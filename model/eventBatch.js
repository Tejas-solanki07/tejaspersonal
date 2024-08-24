const mongoose = require('mongoose')
const joi = require('joi')

const EventbatchSchema = mongoose.Schema({
    EventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'events'
    },
    
    StuName:{
        type:Array
    },
    isCompleted:{
        type:Boolean
    }
})
const EventBatchVAlidation = joi.object({
    EventId:joi.string().required(),
    StuName:joi.array().min(1).required()

})
const EventBacth = mongoose.model('EventbatchSchema',EventbatchSchema)
module.exports={EventBatchVAlidation,EventBacth}