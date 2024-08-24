const mongoose = require('mongoose')
const joi = require('joi')

const seminar = mongoose.Schema({
    College: {
        type: String
    },
    StartDate: {
        type: Date
    },
    EndtDate: {
        type: Date
    },
    Course: {
        type: String
    },
    SeminarTime: {
        type: Date
    },
    Days: {
        type: Array
    },
    IsCompleted: {
        type: Boolean
    }
})

const seminarVAlidation = joi.object({
    College:joi.string().required(),
StartDate:joi.date().required(),
Course:joi.string().required(),
SeminarTime:joi.date().required(),
Days:joi.array().required()
})
module.exports = mongoose.model("seminar", seminar)