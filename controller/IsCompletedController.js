const { BatchCompletedModel, EditCourseCompletedValidation } = require("../model/BatchCompleted");

const Update = async (req, res) => {
  try {
    let UpdateId = req.query.UpdateId;
    let { Studentid, Date, Cetificate } = req.body;
    console.log(req.body, req.query);
    const { error, value } = EditCourseCompletedValidation.validate({ Studentid, Date, Cetificate })
    if (error) {
      return res.status(400).send({ error: error });
    } else {

      let copy = await BatchCompletedModel.findOne({ _id: UpdateId });
      if (!copy) {
        return res.status(404).send({ msg: "Batch not found" });
      }

      console.log(copy);
      let cp = JSON.parse(JSON.stringify(copy));
      let index = cp.StudentArray.findIndex((ele) => ele._id == Studentid);
      if (index === -1) {
        return res.status(404).send({ msg: "Student not found" });
      }

      cp.StudentArray[index].Date = Date;
      cp.StudentArray[index].Cetificate = Cetificate;

      const updateData = await BatchCompletedModel.updateOne({ _id: UpdateId }, cp);

      if (updateData.nModified === 0) {
        return res.status(400).send({ msg: "No changes made" });
      }

      res.status(201).send({ msg: "Data updated successfully" });

    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Internal server error", error: error.message });
  }
}

const getAllData = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    const totalCount = await BatchCompletedModel.countDocuments();
    let data = await BatchCompletedModel.find().populate("CourseId").populate("Astudent").skip(skip).limit(limit).sort({ _id: -1 });
    res.status(201).send({ data,totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Internal server error", error: error.message });
  }
}

module.exports = { Update, getAllData };
