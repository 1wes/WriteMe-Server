const express=require('express');
const router=express.Router();
const dbConnection=require('../db');

router.use((req, res, next)=>{
    next();
})

router.get("/", (req, res)=>{

});

router.get("/order", (req, res)=>{

    dbConnection.query();

});

module.exports=router;