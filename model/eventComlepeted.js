const mongoose=require("mongoose")
const Joi=require("joi")
const Models=mongoose.Schema({
    CourseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"events"
    },
    Astudent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"EventbatchSchema"
    },
    StudentArray:{
        type:Array
    }

})
const EditEventCompletedValidation = Joi.object({
    Studentid: Joi.string().required(), Date: Joi.date().required()
    , Cetificate: Joi.string().required()

})
const EventCompletedModel=mongoose.model("EventCompletedModel",Models)
module.exports={EventCompletedModel,EditEventCompletedValidation}