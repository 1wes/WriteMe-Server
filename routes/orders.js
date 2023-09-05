const express=require('express');
const router=express.Router();
const dbConnection=require('../db');
const path=require('path');
const app=express();
const verifyToken=require('../middleware/cookie-validation.js');
const formidable=require('formidable');
const fs=require('fs');
const generateId=require('../utils/generateId');

router.use((req, res, next)=>{
    next();
})

router.get("/all", verifyToken, (req, res)=>{ 

    const getAllOrder=`SELECT orders.id, order_id,subject, status, date_deadline, first_name,last_name FROM orders RIGHT JOIN users ON orders.created_by=uuid WHERE uuid=${tokenInfo.uuid}`;

    dbConnection.query(getAllOrder, (err, result)=>{

        if(err){
            console.log(err);
        }

        const getOrderStatus=(status)=>{

            return active=result.filter(orders=>
                orders.status==status);
        }
        
        let userInfo={
            name:`${result[0].first_name} ${result[0].last_name}`,
            allOrders:result.length,
            activeOrders:getOrderStatus("Active").length,
            cancelledOrders:getOrderStatus("Cancelled").length,
            completedOrders:getOrderStatus("Completed").length,
            orders:result
        }

        res.send(userInfo);
    })
});

router.post("/new", verifyToken, (req, res)=>{

    switch(statusCode){
        case 200:
            
            const form=new formidable.IncomingForm();

            const rootPath=(path.dirname(__dirname));

            form.parse(req, (err, fields, files)=>{

                if(err){
                    console.log(err);
                }

                if(files.file){
                    const file=files.file[0];
                
                    const oldPath=file.filepath;
    
                    const newPath=`${path.join(rootPath, "public", "files")}/${file.originalFilename}`;
    
                    let fileData=fs.readFileSync(oldPath);

                    fs.writeFile(newPath, fileData, (err)=>{
                        if(err){
                            console.log(err);
                        }
    
                    });
                }

                const {gradeLevel, subject, instructions, pagesOrwords, amount, deadline, time, fileName}=fields;

                let orderId=generateId(100000000);

                let status='Active';

                let createdBy=tokenInfo.uuid;

                let file;

                files.file?file=fileName[0]:''

                const orderDetails=[
                    orderId,
                    createdBy,
                    subject[0],
                    gradeLevel[0],
                    file,
                    instructions[0],
                    pagesOrwords[0],
                    amount[0],
                    deadline[0],
                    time[0],
                    status
                ]

                const createOrder="INSERT INTO orders (order_id, created_by, subject, level, file, instructions, words_or_pages, amount, date_deadline, time_deadline, status) VALUES (?)";

                dbConnection.query(createOrder, [orderDetails], (err)=>{

                    if(err){
                        console.log(err);
                    }

                    res.sendStatus(200);
                });
            })
            break;

        case 401:
            res.sendStatus(401);

            break;

        case 403:
            res.sendStatus(403);

            break;
        
    }

} )

router.get("/order", (req, res)=>{

    dbConnection.query();

});

module.exports=router;