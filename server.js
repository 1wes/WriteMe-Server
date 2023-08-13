const express=require('express');
const app=express();
const port=require('./env-config');

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});
