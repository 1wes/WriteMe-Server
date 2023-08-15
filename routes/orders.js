const express=require('express');
const router=express.Router();
const dbConnection=require('../db');
const path=require('path');
const app=express();
const fs=require('fs');

app.use(express.static(path.join(__dirname, "public")));

router.use((req, res, next)=>{
    next();
})

router.get("/", (req, res)=>{ 

});

router.get("/order", (req, res)=>{

    dbConnection.query();

});

module.exports=router;