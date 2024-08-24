const express = require('express')
const route = express.Router()
const { addSeminar, updateSeminar, deleteSeminar, getAllSeminar ,seminarComleted,getComletedSeminar} = require('../controller/seminarController')

route.post('/addSeminar', addSeminar)
route.post('/UpdateSeminar', updateSeminar)
route.delete('/DeleteSeminar', deleteSeminar)
route.get('/DisplaySeminar', getAllSeminar)
route.post('/Completed',seminarComleted)
route.get('/completedSeminar',getComletedSeminar)

module.exports = route