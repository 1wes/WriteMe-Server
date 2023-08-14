const express=require('express');
const app=express();
const {port}=require('./env-config');
const cors=require('cors');
const ordersAPI=require('./routes/orders');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({}));

app.use("/api", ordersAPI);

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});
