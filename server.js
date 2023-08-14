const express=require('express');
const app=express();
const {port}=require('./env-config');
const router=express.Router();
const cors=require('cors');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({}));

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});
