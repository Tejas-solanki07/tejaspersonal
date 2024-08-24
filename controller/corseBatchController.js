const { courseBatchModel, coursebatchValidation } = require("../model/corseBatchShcema");
const { CourseInquirymodel } = require("../model/corseinquiryshcema");

const addBatch = async (req, res) => {
  try {
    console.log(req.body);
    let { EventId, StuName } = req.body;
    let course11 = req.query.course;

    const { error, value } = coursebatchValidation.validate({ EventId, StuName });

    if (error) {
      return res.status(400).json({ isSuccess: false, error });
    }

    const data = new courseBatchModel({
      EventId,
      StuName,
      isCompleted: false
    });

    await Promise.all(StuName.map(async (ele) => {
      const cp = await CourseInquirymodel.findOne({ _id: ele._id });
      if (cp) {
        let index = cp.Testarr.findIndex(ele1 => ele1.Course === course11);
        console.log("index ", index, "cp", cp);
        if (index !== -1) {
          cp.Testarr[index].isAdded = true;
          await CourseInquirymodel.updateOne({ _id: ele._id }, cp);
          console.log("\n\n\n\nchanged new  ", cp);
        }
      }
    }));

    const data1 = await data.save();
    res.status(201).json({ msg: "Batch Added", data1 });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const updateBatch = async (req, res) => {
  try {
    let { EventId, StuName } = req.body;
    const course11 = req.query.course;
    console.log('====>',EventId)

    const { error, value } = coursebatchValidation.validate({ EventId:EventId, StuName });

    if (error) {
      return res.status(400).json({ isSuccess: false, error });
    }

    const prevdata = await courseBatchModel.findOne({ _id: req.query.id });
    if (prevdata && prevdata.StuName.length > 0) {
      let ids = prevdata.StuName.map(ele => ele._id);
      await CourseInquirymodel.updateMany(
        { _id: { $in: ids } },
        { $set: { 'Testarr.$[elem].isAdded': false } },
        { arrayFilters: [{ 'elem.Course': course11 }] }
      );
    }

    await courseBatchModel.updateOne({ _id: req.query.id }, { StuName, EventId:EventId._id });

    await Promise.all(StuName.map(async (ele) => {
      const cp = await CourseInquirymodel.findOne({ _id: ele._id });
      if (cp) {
        let index = cp.Testarr.findIndex(ele1 => ele1.Course === course11);
        console.log("index ", index, "cp", cp);
        if (index !== -1) {
          cp.Testarr[index].isAdded = true;
          await CourseInquirymodel.updateOne({ _id: ele._id }, cp);
          console.log("\n\n\n\nchanged new  ", cp);
        }
      }
    }));

    res.status(200).json({ msg: "Batch Updated" });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const batchId = req.query.id;
    const course11 = req.query.course;

    const deletedBatch = await courseBatchModel.findByIdAndDelete(batchId);
    if (!deletedBatch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const studentIds = deletedBatch.StuName.map(student => student._id);
    await Promise.all(studentIds.map(async (studentId) => {
      const cp = await CourseInquirymodel.findOne({ _id: studentId });
      if (cp) {
        let index = cp.Testarr.findIndex(ele1 => ele1.Course === course11);
        if (index !== -1) {
          cp.Testarr[index].isAdded = false;
          await CourseInquirymodel.updateOne({ _id: studentId }, cp);
        }
      }
    }));

    res.status(200).json({ msg: "Batch deleted and isAdded flag set to false for associated students" });
  } catch (err) {
    console.error('Error deleting batch:', err);
    res.status(500).json({ error: "Error deleting batch" });
  }
};

const displayBatch = async (req, res) => {
  try {
    const data = await courseBatchModel.find({ EventId: req.query.id }).populate('EventId');
    res.status(200).json({ msg: "Display reg Batch", data });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const completedBatch = async (req, res) => {
  try {
    const data = await courseBatchModel.findOne({ _id: req.query.id });
    if (!data) {
      return res.status(404).json({ error: "Batch not found" });
    }

    let obj = JSON.parse(JSON.stringify(data));
    obj.isCompleted = true;
    await courseBatchModel.updateOne({ _id: req.query.id }, obj);
    res.status(200).json({ msg: "isCompleted flag set", isCompleted: obj.isCompleted });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const displayCompletedBatch = async (req, res) => {
  try {
    const data = await courseBatchModel.find({ isCompleted: true }).populate("EventId");
    res.status(200).json({ data });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

module.exports = { addBatch, updateBatch, deleteBatch, displayBatch, completedBatch, displayCompletedBatch };
