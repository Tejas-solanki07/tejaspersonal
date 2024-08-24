const { eventModel, eventValidation } = require('../model/eventShcema');
const { EventBacth } = require('../model/eventBatch');
const { EventCompletedModel } = require('../model/eventComlepeted');


const addevent = async (req, res) => {
    try {
        let {
            StartDate,
            eventName,
            EndtDate,
            Course,
            BatchTime,
            TypeOfEvent,
            Amount,
            TypeOfPayment,
            Days
        } = req.body;

        const eventdata = new eventModel({
            StartDate,
            EndtDate,
            Course,
            BatchTime,
            TypeOfEvent,
            eventName,
            Days,
            Amount,
            TypeOfPayment,
            IsCompleted: false
        });

        const { error } = eventValidation.validate({
            StartDate,
            eventName,
            Course,
            BatchTime,
            Days,
            TypeOfEvent,
            TypeOfPayment,
            Amount
        });

        if (error) {
            return res.status(400).json({ isSuccess: false, error });
        }

        const data = await eventdata.save();
        res.status(201).json({ isSuccess: true, msg: "Event data added", data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, err });
    }
};

const updateevent = async (req, res) => {
    try {
        let {
            StartDate,
            Course,
            BatchTime,
            Days,
            eventName,
            TypeOfEvent,
            TypeOfPayment,
            Amount
        } = req.body;

        const { error } = eventValidation.validate({
            StartDate,
            Course,
            BatchTime,
            Days,
            eventName,
            TypeOfEvent,
            TypeOfPayment,
            Amount
        });

        if (error) {
            return res.status(400).json({ isSuccess: false, error });
        }

        const data = await eventModel.updateOne({ _id: req.query.id }, req.body);
        res.status(200).json({ isSuccess: true, msg: "Event Updated", data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, err });
    }
};

const deleteevent = async (req, res) => {
    try {
        await eventModel.deleteOne({ _id: req.query.id });
        res.status(200).send({ msg: "Event Deleted" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

const getAllData = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

            if (req.query.limit) {
                const totalCount = await eventModel.countDocuments({ IsCompleted: false });

                const data = await eventModel.find({ IsCompleted: false }).skip(skip).limit(limit).sort({ _id: -1 });
                res.status(200).send({
                    msg: "All Data", data, totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    currentPage: page
                });  
            } else {
                const totalCount = await eventModel.countDocuments({ IsCompleted: false });

        const data = await eventModel.find({ IsCompleted: false }).sort({ _id: -1 });
        res.status(200).send({
            msg: "All Data", data, totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
            }
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

const eventComleted = async (req, res) => {
    try {
        const data = await eventModel.findOne({ _id: req.query.id });
        if (!data) {
            return res.status(404).send({ msg: "Event not found" });
        }



        let AssignData = await EventBacth.find({ EventId: req.query.id });


        if (AssignData.length < 1) {
            return res.status(400).json({ isSuccess: false, error: { details: ["There Should Be Assign Student For This Batch"] } });

        }

        AssignData.map(async (ele) => {
            ele.IsCompleted = true
            const udata = await EventBacth.updateOne({ _id: ele._id }, ele)

            let Eid = req.query.id
            let AssignStuid = ele._id
            let Assignstu = ele.StuName.map((e) => ({ ...e, Date: "-", Certificate: "NO" }))

            let datasave = new EventCompletedModel({
                CourseId: Eid,
                Astudent: AssignStuid,
                StudentArray: Assignstu
            })

            datasave.save().then((data) => {
                console.log("data added success")
            })
                .catch((err) => {
                    res.send({ err })
                })

        })


        let obj = JSON.parse(JSON.stringify(data));
        obj.IsCompleted = true;

        const eudata = await eventModel.updateOne({ _id: req.query.id }, obj);
        res.status(200).send({ msg: "Event Completed" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

const getComletedevent = async (req, res) => {
    try {
        const data = await eventModel.find({ IsCompleted: true }).sort({ _id: -1 });
        res.status(200).send({ msg: "All Completed Events", data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

const getAllevent = async (req, res) => {
    try {
        const data = await eventModel.find({ TypeOfEvent: "event" }).sort({ _id: -1 });
        res.status(200).send({ msg: "All events", data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

const getAllWorkshop = async (req, res) => {
    try {
        const data = await eventModel.find({ TypeOfEvent: "Workshop" });
        res.status(200).send({ msg: "All Workshops", data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

module.exports = { addevent, updateevent, deleteevent, getAllData, eventComleted, getComletedevent, getAllevent, getAllWorkshop };
