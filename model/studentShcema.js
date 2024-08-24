
const mongoose = require('mongoose')
const joi = require('joi')

const student = mongoose.Schema({
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addCorseBatch"

    },
    Name: {
        type: String
    },
    Contact: {
        type: Number
    },
    Email: {
        type: String
    },
    CollegeName: {
        type: String
    },
    AcademicCourse: {
        type: String
    },
    Date: {
        type: Date
    },

    Parentcontact: {
        type: Number
    },
    Tfees: {
        type: Number
    },
    Pfees: {
        type: Number
    },
    Rfees: {
        type: Number
    },
    baseString: {
        type: String
    }
})

const EditStudentVAlidation = joi.object({
    CourseId: joi.string().required(),
    Name: joi.string().required(),
    Contact: joi.number().min(1000000000)
        .message("Phone Number Must Be 10 Digit")
        .max(9999999999).required(),
    Parentcontact: joi.number().min(1000000000)
        .message("Phone Number Must Be 10 Digit")
        .max(9999999999).required(),
    Email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    CollegeName: joi.string().required(),
    Tfees: joi.number().required(),
    AcademicCourse: joi.string().required(),
    Date: joi.date().required(),
    baseString: joi.string().required().messages({
        'any.required': 'Adhaar Card is required'
      })



})


const AddStudentVAlidation = joi.object({
    CourseId: joi.string().required(),
    Parentcontact: joi.number().min(1000000000)
        .message("Phone Number Must Be 10 Digit")
        .max(9999999999).required(),


    Tfees: joi.number().required(),
    AcademicCourse: joi.string().required(),
    Date: joi.date().required(),
    baseString: joi.string().required().messages({
        'any.required': 'Adhaar Card is required'
      })



})

const stuModel = mongoose.model('student', student)
module.exports = { stuModel, EditStudentVAlidation,AddStudentVAlidation }