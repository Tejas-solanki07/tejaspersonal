const { AddCourseModel, validation } = require('../model/addCorsebatch');
const { courseBatchModel } = require('../model/corseBatchShcema');
const { BatchCompletedModel } = require("../model/BatchCompleted")

const addBatchEvent = async (req, res) => {
    try {
        let {
            Course,
            StartDate,
            Days,
            BatchTime,
            batchName
        } = req.body;

        const { error, value } = validation.validate({
            Course,
            StartDate,
            Days,
            BatchTime,
            batchName
        });

        if (error) {
            return res.status(400).json({ isSuccess: false, error });
        }

        const eventdata = new AddCourseModel({
            StartDate,
            Course,
            batchName,
            BatchTime,
            Days,
            IsCompleted: false
        });

        const data = await eventdata.save();
        res.status(201).json({ msg: "Event Batch added", data });
    } catch (err) {
        res.status(500).json({ err });
    }
};

const updatBatchEvent = async (req, res) => {
    try {
        let {
            Course,
            StartDate,
            Days,
            BatchTime,
            batchName
        } = req.body;

        const { error, value } = validation.validate({
            Course,
            StartDate,
            Days,
            BatchTime,
            batchName
        });

        if (error) {
            return res.status(400).json({ isSuccess: false, error });
        }

        const data = await AddCourseModel.updateOne({ _id: req.query.id }, req.body);
        res.status(200).json({ msg: "Event batch Updated", data });
    } catch (err) {
        res.status(500).json({ err });
    }
};

const deleteBatchEvent = async (req, res) => {
    try {
        await AddCourseModel.deleteOne({ _id: req.query.id });
        res.status(200).json({ msg: "Event batch Deleted" });
    } catch (err) {
        res.status(500).json({ err });
    }
};

const getAllData = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        console.log("p",page)
        console.log("l",limit)
        const skip = (page - 1) * limit;

        if (req.query.limit) {
            
            const totalCount = await AddCourseModel.countDocuments({ IsCompleted: false });
    
            const data = await AddCourseModel.find({ IsCompleted: false }).skip(skip).limit(limit).sort({ _id: -1 });
            console.log("api called",data)
            res.status(200).json({ msg: "All Data",  data,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page});
        }
        else{
            const totalCount = await AddCourseModel.countDocuments({ IsCompleted: false });
    
            const data = await AddCourseModel.find({ IsCompleted: false });
            console.log("api called",data)
            res.status(200).json({ msg: "All Data",  data,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page});  
        }

    } catch (err) {
        res.status(500).json({ err });
    }
};

const postiscompleted = async (req, res) => {
    try {
        const getid = req.query.id;
      

        const batcharr = await courseBatchModel.find({ EventId: req.query.id });

        if (batcharr.length < 1) {
            return res.status(400).json({ isSuccess: false, error: { details: ["There Should Be Assign Student For This Batch"] } });


        } else {
            for (let ele of batcharr) {
                ele.isCompleted = true;

                await courseBatchModel.updateOne({ _id: ele._id }, ele);

                let Cid = req.query.id
                let Astudent = ele._id
                let StudentArray = ele.StuName.map((e) => { return { ...e, Date: "-", Cetificate: "NO" } })
                
                const datas = new BatchCompletedModel({
                    CourseId: Cid,
                    Astudent,
                    
                    StudentArray
                    
                })
                datas.save().then(async(data1)=>{
                    console.log("data saved",data1)
                }).catch((err)=>{
                    console.log(err)
                })
                
            }
                
                
                
                
            const getiscomp = await AddCourseModel.findByIdAndUpdate(getid, { IsCompleted: true }, { new: true });

            res.status(200).json({ msg: 'Batch event completed', getiscomp });
        }
    } catch (err) {
        res.status(500).json({ err: 'Error in completing' });
    }
};

const getiscompleted = async (req, res) => {
    try {
        const getcompleted = await AddCourseModel.find({ IsCompleted: true });
        res.status(200).json({ msg: 'Display completed data', getcompleted });
    } catch (err) {
        res.status(500).json({ err: 'Error in displaying completed data' });
    }
};

const allcourse = async (req, res) => {
    try {
        const getdata = await AddCourseModel.find().sort({_id:-1})
        res.send({ data: getdata })
    }
    catch (err) {
        res.send({ err })
    }
}

module.exports = {
    addBatchEvent,
    updatBatchEvent,
    deleteBatchEvent,
    getAllData,
    postiscompleted,
    getiscompleted,
    allcourse
};
