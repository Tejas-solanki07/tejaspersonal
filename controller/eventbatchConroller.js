const { EventBacth, EventBatchVAlidation } = require("../model/eventBatch");
const { eventInquiryModel } = require("../model/eventInquiryShcema");

const addBatch = async (req, res) => {
    try {
        let { EventId, StuName } = req.body;

        const data = new EventBacth({
            EventId,
            StuName,
            isCompleted: false
        });

        const { error } = EventBatchVAlidation.validate({ StuName,EventId });

        if (error) {
            return res.status(400).json({ isSuccess: false, error });
        }

        const data1 = await data.save();

        let arr = StuName.map(ele => ele._id);
        const filter = { _id: { $in: arr } };
        const update = { $set: { isAdded: true } };

        const result = await eventInquiryModel.updateMany(filter, update);
        console.log(`${result.modifiedCount} documents were updated.`);
        res.status(201).json({ isSuccess: true, msg: "Batch Added", data1 });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, err });
    }
};

const updateBatch = async (req, res) => {
    try {
        let { StuName, EventId } = req.body;

        const { error } = EventBatchVAlidation.validate({ StuName ,EventId});

        if (error) {
            return res.status(400).json({ isSuccess: false, error });
        }

        const prevdata = await EventBacth.findOne({ _id: req.query.id });

        if (prevdata && prevdata.StuName.length > 0) {
            let ids = prevdata.StuName.map(ele => ele._id);
            await eventInquiryModel.updateMany({ _id: { $in: ids } }, { $set: { isAdded: false } });
        }

        if (StuName.length > 0) {
            await EventBacth.updateOne({ _id: req.query.id }, { StuName, EventId: EventId._id });
            let id1 = StuName.map(ele => ele._id);
            await eventInquiryModel.updateMany({ _id: { $in: id1 } }, { $set: { isAdded: true } });
            res.status(201).json({ isSuccess: true, msg: "Data set successfully" });
        } else {
            await EventBacth.updateOne({ _id: req.query.id }, { StuName, EventId: EventId._id });
            res.status(201).json({ isSuccess: true, msg: "Please provide some data" });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ isSuccess: false, err });
    }
};

const deleteBatch = async (req, res) => {
    try {
        const batchId = req.query.id;
        const deletedBatch = await EventBacth.findByIdAndDelete(batchId);

        if (deletedBatch) {
            const studentIds = deletedBatch.StuName.map(student => student._id);
            await eventInquiryModel.updateMany({ _id: { $in: studentIds } }, { $set: { isAdded: false } });
            res.send({ msg: "Batch Deleted and isAdded flag set to false for associated students" });
        } else {
            res.status(404).send({ error: "Batch not found" });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: "Error deleting batch" });
    }
};

const displayBatch = async (req, res) => {
    try {
        const data = await EventBacth.find({ EventId: req.query.id }).populate('EventId').sort({ _id: -1 });
        res.send({ msg: "Display Batch", data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

const completedBatch = async (req, res) => {
    try {
        const data = await EventBacth.findOne({ _id: req.query.id });

        if (data) {
            let obj = JSON.parse(JSON.stringify(data));
            obj.isCompleted = true;
            await EventBacth.updateOne({ _id: req.query.id }, obj);
            res.send({ msg: "isCompleted flag set", isCompleted: obj.isCompleted });
        } else {
            res.status(404).send({ error: "Batch not found" });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

const displayCompletedBatch = async (req, res) => {
    try {
        const data = await EventBacth.find({ isCompleted: true }).sort({ _id: -1 });
        res.send({ data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ err });
    }
};

module.exports = { addBatch, updateBatch, deleteBatch, displayBatch, completedBatch, displayCompletedBatch };
