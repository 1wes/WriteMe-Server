const express=require('express');
const app=express();
const {port}=require('./env-config');
const cors=require('cors');
const ordersAPI=require('./routes/orders');
const clients=require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

app.use("/api", ordersAPI);
app.use("/api/user", clients);

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});
