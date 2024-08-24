const {AddCourseModel}=require("../model/addCorsebatch")
const {courseBatchModel}=require("../model/corseBatchShcema")
const {eventModel}=require("../model/eventShcema")
const {EventBacth}=require("../model/eventBatch")
const CourseData = async (req, res) => {
    try {
      let day = req.query.day;
      let data = await AddCourseModel.find({ IsCompleted: false, Days: day });
      let eventdata = await eventModel.find({ IsCompleted: false, Days: day });
      res.status(200).send({ data,eventdata });
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while fetching course data', error: error.message });
    }
  }
  
  const StudentDetails = async (req, res) => {
    try {
      let courseId = req.query.courseId;
      let data = await courseBatchModel.find({ EventId: courseId, isCompleted: false });
      res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while fetching student details', error: error.message });
    }
  }
  const EventStudentDetails = async (req, res) => {
    try {
      let courseId = req.query.courseId;
      console.log("c",courseId)
      let data = await EventBacth.find({ EventId: courseId, isCompleted: false });
      console.log(data,"jdnvnd")
      res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while fetching student details', error: error.message });
    }
  }
  
module.exports={CourseData,StudentDetails,EventStudentDetails}