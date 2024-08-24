const express = require('express')
const route = express.Router()
const {login}=require('../controller/loginController')



route.post("/login",login);

module.exports=route;