const express = require('express')
require('./dbConfig')
require('dotenv').config()

const rout = require('./router/invoicsRoute')
const routinqry = require('./router/corseinquryRoute')
const ruotStu = require('./router/studentRoute')
const routInternship = require('./router/eventRoute')
const routSeminar = require('./router/seminarRoute')
const eventInquiry = require("./router/eventInquiryRoute")
const batch = require('./router/eventbatchRoute')
const batchevent = require('./router/addcorseRoute')
const regBatch = require('./router/corseBatchRoute')
const login=require('./router/loginRoute')
const ISC=require("./router/IsCompletedRoute")
const EventComleted = require("./router/isCompletedEvent")
const Dashboard=require("./router/DashboardRoutes")
const app = express()

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});



// app.use(express.json())


app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.use('/login',login)
app.use('/invoice', rout)
app.use('/inquiry', routinqry)
app.use('/student', ruotStu)
app.use('/event', routInternship)
app.use('/Seminar', routSeminar)
app.use('/Eventinquiry',eventInquiry)
app.use('/Batch',batch)
app.use('/batchEvent',batchevent)
app.use('/regBatch',regBatch)
app.use("/ISC",ISC)
app.use("/EventComleted",EventComleted)
app.use("/Dashboard",Dashboard)

app.listen(process.env.PORT, () => {
  console.log(`port is run on ${process.env.PORT}`)
})