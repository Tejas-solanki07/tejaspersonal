const { stuModel,EditStudentVAlidation,AddStudentVAlidation } = require('../model/studentShcema');
const { AddCourseModel } = require('../model/addCorsebatch');
const {CourseInquirymodel} = require('../model/corseinquiryshcema')


const addStudent = async (req, res) => {
  try {
    let { 
      inquiryId, CourseId,  AcademicCourse, Date, 
      baseString,  Parentcontact, Tfees 
    } = req.body;

    
    const {error,value}=AddStudentVAlidation.validate({
      CourseId,Parentcontact,Tfees ,  AcademicCourse, Date, 
      baseString
    })
    if (error) {
      res.status(404).send({ error });   
    }
    
    else{ 
      const cousreData = await CourseInquirymodel.findOne({_id:inquiryId})

    let index = cousreData.stuAddedArr.findIndex((ind)=>{
    
      return ind.Course == req.query.course
    
    })
    cousreData.stuAddedArr[index].isStuAdded=true
    

    const ud = await CourseInquirymodel.updateOne({_id:req.body.inquiryId},cousreData)

    const stuData = new stuModel({
      Name:cousreData.FullName, Contact:cousreData.Contact, CourseId, Email:cousreData.Email, CollegeName:cousreData.CollageName, AcademicCourse, 
      Rfees: parseInt(Tfees), Date,  Parentcontact, 
      Pfees: 0, Tfees: parseInt(Tfees), baseString
    });

    


    const data = await stuData.save();
    res.status(201).json({ msg: "Student Data Added", data });
  } 
  
}
  catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }

};

const updateStu = async (req, res) => {
  try {

    let { 
      Name, CourseId, Contact, Email, CollegeName, AcademicCourse, Date, 
      baseString,  Parentcontact, Tfees 
    } = req.body;
console.log("-->",CourseId)
    const {error,value}=EditStudentVAlidation.validate({
      CourseId:CourseId._id,Name, Contact,Parentcontact,Tfees , Email, CollegeName, AcademicCourse, Date, 
        baseString
   })
   if (error) {
     res.status(404).send({ error });
       
   }
   else{

    const data = await stuModel.updateOne({ _id: req.query.id }, { ...req.body, CourseId:CourseId});
    res.status(200).json({ msg: "Student Updated", data });
  } 
}
  catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const deleteStu = async (req, res) => {
  try {
    await stuModel.deleteOne({ _id: req.query.id });
    res.status(200).json({ msg: "Student Deleted" });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const getAllStu = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;


    const totalCount = await stuModel.countDocuments({ CourseId: req.query.id });


    const data = await stuModel.find({ CourseId: req.query.id }).populate("CourseId").skip(skip).limit(limit).sort({ _id: -1 });
    res.status(200).json({ msg: "All student", data,totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const Alldata = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalCount = await stuModel.countDocuments();

    const data = await stuModel.find().populate("CourseId").skip(skip).limit(limit);
    res.status(200).json({ data ,totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const InvoiceGet = async (req, res) => {
  try {
    const courseId = req.query.id;
    const students = await stuModel.find({ CourseId: courseId, Rfees: { $ne: 0 } }).populate("CourseId");
    res.status(200).json({data:students});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

const fillterbyDate = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    let { key, sortby, courseid } = req.query;
    sortby = parseInt(sortby);
    let totalCount;
    let data;
    if (!courseid) {
      totalCount = await stuModel.countDocuments();
      data = await stuModel.find().sort({ [key]: sortby }).populate("CourseId").skip(skip).limit(limit);;
    } else {
      totalCount = await stuModel.countDocuments({ CourseId: courseid });
      data = await stuModel.find({ CourseId: courseid }).sort({ [key]: sortby }).populate("CourseId").skip(skip).limit(limit);;
    }

    res.status(200).json({ data, msg: "Filtered" , totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

const filterByMonth = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;


    let { perentId, month, sort } = req.query;
    sort = parseInt(sort);
      let totalCount;
    let data;
    if (!perentId) {
       totalCount = await stuModel.countDocuments({
        $expr: {
          $eq: [{ $month: "$Date" }, month]
        }
      });

      data = await stuModel.find({
        $expr: {
          $eq: [{ $month: "$Date" }, month]
        }
      }).sort({ Date: sort }).populate("CourseId").skip(skip).limit(limit);;
    } else {

      totalCount = await stuModel.countDocuments({
        $expr: {
          $eq: [{ $month: "$Date" }, month]
        },
        CourseId: perentId
      });

      data = await stuModel.find({
        $expr: {
          $eq: [{ $month: "$Date" }, month]
        },
        CourseId: perentId
      }).sort({ Date: sort }).populate("CourseId").skip(skip).limit(limit);;
    }

    res.status(200).json({data, totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const search = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let Name=req.query.Name;
    if(Name){
      Name=Name.trim()
    }

    const filter = {
  
    
      Name: { $regex: new RegExp(Name, 'i') }
  };
  const totalCount = await stuModel.countDocuments(filter);


  const populatedata = await stuModel.find(filter).populate("CourseId").skip(skip).limit(limit);;

  
   
    res.status(200).json({ data:populatedata , totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ err });
  }
};

module.exports = { addStudent, updateStu, search, deleteStu, getAllStu,InvoiceGet, fillterbyDate, Alldata, filterByMonth, InvoiceGet };
