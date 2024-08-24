const { invoiceModel, InvoiceValidation } = require('../model/invoiceSchema');
const { stuModel } = require('../model/studentShcema')
require('dotenv').config()
const { jsPDF } = require("jspdf");


require('jspdf-autotable');
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');

const getImageBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const addInvoice = async (req, res) => {
    try {
        const { courseId, stuId, Amount, invoiceDate, TypeOfPayment } = req.body;

        // Validate the request body
        const { error } = InvoiceValidation.validate({
            courseId,
            stuId,
            Amount,
            invoiceDate,
            TypeOfPayment
        });

        if (error) {
            return res.status(400).send({ error: error });
        }

        // Generate the new invoice ID
        const length = await invoiceModel.countDocuments();
        const invoiceId = `INV0${new Date().getMonth() + 1}00${length + 1}`;

        // Create a new invoice document
        const newInvoice = new invoiceModel({
            stuId,
            invoiceDate,
            invoiceId,
            Amount: parseInt(Amount),
            TypeOfPayment,
            Description: "THANK'S FOR PAYMENT!",
            courseId,
            isDeleted: false
        });

        // Find the student
        const student = await stuModel.findById(stuId).select('Rfees Pfees')
        if (!student) {
            return res.status(404).send({ msg: "Student not found" });
        }

        // Check if the paid amount exceeds the remaining fees
        if (parseInt(Amount) > student.Rfees) {
            return res.status(400).send({ error: { details: [{ message: "Paid amount must be less than total amount" }] } });
        }

        // Update the student's fees
        student.Rfees -= parseInt(Amount);
        student.Pfees += parseInt(Amount);
        await stuModel.updateOne(
            { _id: stuId },
            { $set: { Rfees: student.Rfees, Pfees: student.Pfees } }
        );

        // Save the new invoice
        const savedInvoice = await newInvoice.save();
        res.status(201).send({ msg: "Data Added", data: savedInvoice });

    } catch (err) {
        console.error("Error adding invoice:", err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


const updateinvoice = async (req, res) => {
    try {
        // Destructure and validate request body
        const { courseId, stuId, Amount, invoiceDate, TypeOfPayment } = req.body;
        const { error } = InvoiceValidation.validate({
            courseId: courseId._id,
            stuId: stuId._id,
            Amount,
            invoiceDate,
            TypeOfPayment
        });

        if (error) {
            return res.status(400).send({ error: error.details });
        }

        const invoiceId = req.query.id;
        const studentId = stuId._id;
        const newAmount = parseInt(Amount);

        // Find the invoice by ID
        const invoiceData = await invoiceModel.findById(invoiceId);
        if (!invoiceData) {
            return res.status(404).send({ error: { details: [{ message: "Invoice Not Found" }] } });
        }

        // Find the student by ID
        const studentData = await stuModel.findById(stuId).select('Rfees Pfees');
        if (!studentData) {
            return res.status(404).send({ error: { details: [{ message: "Student Not Found" }] } });
        }

        // Update the student's fees
        const oldAmount = parseInt(invoiceData.Amount);
        let updatedStudent = { ...studentData.toObject() };
        updatedStudent.Rfees += oldAmount;
        updatedStudent.Pfees -= oldAmount;

        if (newAmount > updatedStudent.Rfees) {
            return res.status(400).send({ error: { details: [{ message: "Paid amount must be less than total amount" }] } });
        }

        updatedStudent.Rfees -= newAmount;
        updatedStudent.Pfees += newAmount;

        // Save the updated student data
        await stuModel.updateOne(
            { _id: stuId },
            { $set: { Rfees: updatedStudent.Rfees, Pfees: updatedStudent.Pfees } }
        );

        // Update the invoice amount
        invoiceData.Amount = newAmount;
        await invoiceModel.updateOne({ _id: invoiceId }, {
            ...invoiceData.toObject(),
            ...req.body,
            stuId: studentId,
            courseId: courseId._id
        });

        res.send({ msg: "Invoice and student fees updated successfully" });

    } catch (err) {
        console.error("Error updating invoice:", err);
        res.status(500).send({ error: 'Internal Server Error', msg: "Update failed" });
    }
};






// const deletinvoice = async (req, res) => {
//     try {
//         // Destructure request body and query parameters
//         const { stuId, Amount } = req.body;
//         const invoiceId = req.query.id;

//         // Validate input
//         if (!invoiceId || !stuId || !Amount) {
//             return res.status(400).send({ msg: "Missing required fields" });
//         }

//         // Find the invoice by ID
//         const invoiceData = await invoiceModel.findById(invoiceId);
//         if (!invoiceData) {
//             return res.status(404).send({ msg: "Invoice not found" });
//         }

//         // Find the student by ID
//         const studentData = await stuModel.findById(stuId._id);
//         if (!studentData) {
//             return res.status(404).send({ msg: "Student not found" });
//         }

//         // Update the student's fees
//         const oldAmount = parseInt(invoiceData.Amount);
//         let updatedStudent = { ...studentData.toObject() };
//         updatedStudent.Rfees += oldAmount;
//         updatedStudent.Pfees -= oldAmount;

//         // Save the updated student data
//         await stuModel.updateOne({ _id: stuId._id }, updatedStudent);

//         // Mark the invoice as deleted and set Amount to 0
//         await invoiceModel.updateOne(
//             { _id: invoiceId },
//             { isDeleted: true, Amount: 0 }
//         );

//         res.send({ msg: "Invoice and student fees deleted successfully" });
//     } catch (err) {
//         console.error("Error deleting invoice:", err);
//         res.status(500).send({ error: 'Internal Server Error', msg: "Update failed" });
//     }
// };


const displayInvoice = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalCount = await invoiceModel.countDocuments({ isDeleted: false });

        // Find all non-deleted invoices and populate student and course data
        const data = await invoiceModel.find({ isDeleted: false })
            .populate({
                path: 'stuId',
                select: '-baseString'
            })
            .populate("courseId").skip(skip).limit(limit).sort({ _id: -1 });

        // Send successful response with invoice data
        res.send({
            msg: "Display invoice", data,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (err) {
        // Log the error and send a server error response
        console.error("Error fetching invoices:", err);
        res.status(500).send({ error: 'Internal Server Error', msg: "Failed to fetch invoices" });
    }
};


const courseInvoice = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Extract the courseId from query parameters
        const courseId = req.query.parentId;

        if (!courseId) {
            return res.status(400).send({ msg: "Course ID is required" });
        }

        const totalCount = await invoiceModel.countDocuments({ courseId, isDeleted: false });
        // Find invoices for the specified course and ensure they are not deleted
        const data = await invoiceModel.find({ isDeleted: false, courseId })
            .populate({
                path: 'stuId',
                select: '-baseString'
            })
            .populate("courseId").skip(skip).limit(limit).sort({ _id: -1 });

        // Send successful response with invoice data
        totalCount,
            res.send({
                msg: "Display invoice for the course", data, totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page
            });
    } catch (err) {
        // Log the error and send a server error response
        console.error("Error fetching invoices for the course:", err);
        res.status(500).send({ error: 'Internal Server Error', msg: "Failed to fetch invoices for the course" });
    }
};

const nmailer = async (pdfBuffer, row) => {
    try {
        // Create a transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_SECRET_KEY,
            },
        });

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL, // sender address
            to: row.stuId.Email, // recipient address
            subject: "Invoice", // Subject line
            text: 'Please find attached the invoice.', // plain text body
            attachments: [
                {
                    filename: `${row.stuId.Name}_${row.courseId.Course}.pdf`,
                    content: pdfBuffer, // use the buffer generated from the PDF
                    contentType: 'application/pdf',
                }
            ],
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        // Log success
        console.log("Email sent:", info.response);
    } catch (error) {
        // Log error
        console.error("Error sending email:", error);
    }
};




const pdfmail = async (req, res) => {
    const row = req.body;

    try {
        // Initialize PDF document
        const doc = new jsPDF();

        // Set background color
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

        // Load and add image
        const imagePath = path.join(__dirname, 'name.png');
        try {
            const imgBase64 = await getImageBase64(imagePath);
            const logoWidth = 50;
            const logoHeight = 20;
            const centerX = doc.internal.pageSize.width / 2 - logoWidth / 2;
            doc.addImage(imgBase64, 'PNG', centerX, 10, logoWidth, logoHeight);
        } catch (error) {
            console.error('Error loading image:', error);
        }

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 110);
        doc.text('Fees Receipt'.toUpperCase(), doc.internal.pageSize.width / 2, 40, { align: 'center' });

        // Table content
        const table = {
            headers: ['Field', 'Value'],
            body: [
                ['Invoice ID', row.invoiceId],
                ['Date', row.invoiceDate ? row.invoiceDate.split('T')[0] : ''],
                ['Student Name', row.stuId.Name || ''],
                ['Course Name', row.courseId.Course || ''],
                ['Payment Method', row.TypeOfPayment || ''],
                ['Paid Amount', row.Amount || '']
            ],
        };

        // Add table to PDF
        doc.autoTable({
            startY: 60,
            head: [table.headers],
            body: table.body,
            theme: 'striped',
            styles: {
                cellPadding: 3,
                fontSize: 10,
                valign: 'middle',
                halign: 'center',
                fontStyle: 'normal',
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 110],
                fontStyle: 'bold',
            },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 'auto' },
            },
        });

        // Footer
        const footerText = [
            'Email: info@technishal.com',
            'Contact: +91 9313386475',
            'Address: H-1210, Titanium City Center Business Park,',
            'Nr. Prahlad Nagar Rd, Jodhpur Village,',
            'Ahmedabad, Gujarat 380015.',
        ];

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        // Add horizontal line
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(10, doc.internal.pageSize.height - 30, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 30);

        // Add footer text with spacing
        let footerY = doc.internal.pageSize.height - 25;
        footerText.forEach(text => {
            doc.text(text, doc.internal.pageSize.width / 2, footerY, { align: 'center' });
            footerY += 5;
        });

        // Add computer-generated note and copyright
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('This is a computer-generated invoice. Signature not required.', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 50, { align: 'center' });

        doc.setFontSize(8);
        doc.text('© 2023 TechNishal. All Rights Reserved.', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, { align: 'center' });

        // Convert PDF to buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        // Send the email with the PDF attachment
        await nmailer(pdfBuffer, row);

        // Send response to client
        res.send('Invoice generated and email sent.');
    } catch (err) {
        console.error('Error generating invoice:', err);
        res.status(500).send('Error generating invoice');
    }
};

const fillterbyDate = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;



        const { key, sortby, courseId } = req.query;
        const sortOrder = parseInt(sortby, 10); // Convert sortby to an integer

        // Validate sortOrder (1 for ascending, -1 for descending)
        if (![1, -1].includes(sortOrder)) {
            return res.status(400).send({ error: 'Invalid sort order. Use 1 for ascending or -1 for descending.' });
        }

        // Build query object
        const query = courseId ? { courseId } : {};

        // Define projection to include necessary fields
        const projection = '_id stuId courseId invoiceId invoiceDate Amount TypeOfPayment Description isDeleted';

        // Query invoices with projection and populate references
        const totalCount = await invoiceModel.countDocuments(query);


        let data = await invoiceModel.find(query)
            .select(projection)
            .populate({
                path: 'stuId',
                select: '-baseString'
            })
            .populate('courseId')
            .skip(skip).limit(limit)
            .exec();

        // Sort data based on the specified key
        if (key) {
            if (key === 'Name') {
                data.sort((a, b) => sortOrder * a.stuId.Name.localeCompare(b.stuId.Name));
            } else if (key === 'Rfees') {
                data.sort((a, b) => sortOrder * (parseInt(b.stuId.Rfees) - parseInt(a.stuId.Rfees)));
            } else if (key === 'invoiceDate') {
                data.sort((a, b) => sortOrder * (new Date(b.invoiceDate) - new Date(a.invoiceDate)));
            } else {
                return res.status(400).send({ error: 'Invalid sort key. Use "Name", "Rfees", or "invoiceDate".' });
            }
        }

        // Send the response with the sorted and populated data
        res.send({
            data, totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error in fillterbyDate:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};





const filterByMonth = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit
        const { courseId, month, sort } = req.query;

        // Validate and parse `month` and `sort` parameters
        const parsedMonth = parseInt(month, 10);
        const parsedSort = parseInt(sort, 10);

        if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
            return res.status(400).json({ error: 'Invalid month. Please provide a number between 1 and 12.' });
        }

        if (![1, -1].includes(parsedSort)) {
            return res.status(400).json({ error: 'Invalid sort order. Use 1 for ascending or -1 for descending.' });
        }

        // Build the query object
        const query = {
            $expr: {
                $eq: [{ $month: "$invoiceDate" }, parsedMonth]
            }
        };

        if (courseId) {
            query.courseId = courseId;
        }
        const totalCount = await invoiceModel.countDocuments(query);

        // Fetch and sort the data
        const data = await invoiceModel.find(query)
            .sort({ invoiceDate: parsedSort })
            .populate({
                path: 'stuId',
                select: '-baseString'
            })
            .populate("courseId")
            .skip(skip).limit(limit)
            .exec();

        res.json({
            data, totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error in filterByMonth:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const search = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit

        // Ensure `name` query parameter is provided
        let { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Query parameter "name" is required.' });
        }
        name = name.trim();

        // Query to find matching invoices with a populated student
        const totalCount = await invoiceModel.countDocuments({
            stuId: {
                $in: await stuModel.find({ Name: { $regex: new RegExp(name, 'i') } }).distinct('_id')
            }
        });

        const populatedata = await invoiceModel.find({
            stuId: {
                $in: await stuModel.find({ Name: { $regex: new RegExp(name, 'i') } }).distinct('_id')
            }
        })
            .populate({
                path: 'stuId',
                select: { baseString: 0 } // Exclude `baseString` while including all other fields
            })
            .populate('courseId')
            .skip(skip).limit(limit)
            .exec();

        // Send filtered data
        res.status(200).json({
            filterdata: populatedata, totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error in search:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { addInvoice, updateinvoice, search, courseInvoice, displayInvoice, pdfmail, fillterbyDate, filterByMonth };
