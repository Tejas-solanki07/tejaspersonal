const Joi = require("joi")
const mongoose = require("mongoose")
const Models = mongoose.Schema({
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addCorseBatch"
    },
    Astudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RagularbatchSchema"
    },
    StudentArray: {
        type: Array
    }

})

const EditCourseCompletedValidation = Joi.object({
    Studentid: Joi.string().required(), Date: Joi.date().required()
    , Cetificate: Joi.string().required()

})
const BatchCompletedModel = mongoose.model("BatchCompletedModel", Models)
module.exports = { BatchCompletedModel,EditCourseCompletedValidation }