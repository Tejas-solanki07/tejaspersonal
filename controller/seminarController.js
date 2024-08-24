const model = require('../model/seminarShcema')



const addSeminar = (req, res) => {
    let { College,
        StartDate,
        EndtDate,
        Course,
        SeminarTime,
        Days,
    } = req.body


    const seminardata = new model({
        College,
        StartDate,
        EndtDate,
        Course,
        SeminarTime,
        SeminarType,
        Days,
        IsCompleted: false

    })

    seminardata.save().then((data) => {
        res.send({ msg: "Seminar data added", data })
    })
        .catch((err) => {
            res.send({ err })
        })
}

const updateSeminar = (req, res) => {



    model.updateOne({ _id: req.query.id }, req.body)
        .then((data) => {
            res.send({ msg: "Seminar Updated", data })
        })
        .catch((err) => {
            res.send({ err })
        })

}

const deleteSeminar = (req, res) => {
    model.deleteOne({ _id: req.query.id })
        .then((data) => {
            res.send({ msg: "Seminar DEleted" })
        })
        .catch((err) => {
            res.send({ err })
        })
}

const getAllSeminar = (req, res) => {
    model.find().then((data) => {
        res.send({ msg: "All Seminar", data })
    })
        .catch((err) => {
            res.send({ err })
        })
}

const seminarComleted = (req, res) => {
    model.findOne({ _id: req.query.id }).then((data) => {
        let obj = JSON.parse(JSON.stringify(data))
        obj.IsCompleted = true

        model.updateOne({ _id: req.query.id }, obj).then((data1) => {
            res.send({ msg: "Seminar Comleted" })
        })
            .catch((err2) => {
                res.send({ err2 })
            })

    })
        .catch((err) => {
            res.send({ err })
        })
}

const getComletedSeminar = (req, res) => {
    model.find({ IsCompleted: true }).then((data) => {
        res.send({ msg: "All Comleted Seminar", data })
    })
        .catch((err) => {
            res.send({ err })
        })
}

module.exports = { addSeminar, updateSeminar, deleteSeminar, getAllSeminar, seminarComleted, getComletedSeminar }