const express=require('express');
const router=express.Router();
const dbConnection=require('../db');
const path=require('path');
const app=express();
const verifyToken=require('../middleware/cookie-validation.js');
const formidable=require('formidable');
const fs=require('fs');
const generateId = require('../utils/generateId');
const transporter = require('../utils/mail');
const { senderEmail } = require('../env-config');

router.use((req, res, next)=>{
    next();
})

const getOrderStatus=(status, result)=>{
        
    return active=result.filter(orders=>
        orders.status==status);
}

router.get("/admin", verifyToken, (req, res)=>{

    switch(statusCode){

        case 200:

            if(tokenInfo.role==="Admin"){
                const username=`${tokenInfo.firstName} ${tokenInfo.lastName}`
            
                const allOrders=`SELECT orders.*, first_name, last_name FROM orders INNER JOIN users ON orders.created_by=uuid ORDER by id DESC`;
                
                dbConnection.query(allOrders, (err, result)=>{
    
                    if(err){
                        console.log(err);
                    }
    
                    const orders={
                        username:username,
                        totalOrders:result.length,
                        allActiveOrders:getOrderStatus('Active', result).length,
                        allCancelledOrders:getOrderStatus('Cancelled', result).length,
                        allCompletedOrders:getOrderStatus('Completed', result).length,
                        allOrders:result.length==0?[]:result
                    }
    
                    res.send(orders);
    
                });
            }else{
                return res.sendStatus(401);
            }

            break;

        case 401:
            res.sendStatus(401);

            break; 

        case 403:
            res.sendStatus(403);

            break;
    }
})

router.get("/order/:id", verifyToken, (req, res)=>{

    switch(statusCode){

        case 200:

            if(tokenInfo.role==="Admin"){

                const id=req.params.id;

                const username=`${tokenInfo.firstName} ${tokenInfo.lastName}`;

                const row=`SELECT orders.*, first_name, last_name, email from orders RIGHT JOIN users on created_by=uuid where order_id=?`;

                const attachments=[];

                dbConnection.query(row, id, (err, result)=>{

                    if(err){
                        console.log(err);
                    }

                    let order;

                    if(result[0].files){

                        attachments.push(result[0].files);

                        fs.readdir(path.join(path.dirname(__dirname), "public", "files", result[0].files), (err, data)=>{
                            order={...result[0], username:username, attachedFiles:attachments, fileNames:data}

                            res.send(order);
                        })
                    }else{
                        order={...result[0], username:username, attachedFiles:attachments}
                        res.send(order)
                    }
                })
            }else{
                return res.sendStatus(401);
            }

            break;
        
        case 401:
            res.sendStatus(401);

            break;

        case 403:
            res.sendStatus(403);

            break;
    }
});

router.get("/order/files/:folder/:fileName", verifyToken, (req, res)=>{
    
    switch(statusCode){

        case 200:

            if(tokenInfo.role==="Admin"){

                const rootPath=path.dirname(__dirname);

                const filePath=path.join(rootPath, "public", "files", req.params.folder);

                const file=path.join(filePath, req.params.fileName);

                res.sendFile(file);
            }else{
                res.sendStatus(401);
            }

            break;

        case 401:
            res.sendStatus(401);

            break;

        case 403:
            res.sendStatus(403);

            break;
    }
});

router.put("/order/update/:orderId", verifyToken, (req, res)=>{

    switch(statusCode){

        case 200:

            if(tokenInfo.role==="Admin"){

                let {status}=req.body;

                let {orderId}=req.params;

                const updateStatement=`UPDATE orders SET status='${status}' WHERE order_id=?`;

                dbConnection.query(updateStatement, orderId, (err)=>{

                    if(err){
                        console.log(err)
                    }else{
                        res.sendStatus(200);
                    }
                })
            }else{
                res.sendStatus(401);
            }

            break;

        case 401:
            res.sendStatus(401);

            break;

        case 403:
            res.sendStatus(403);

            break;
    }
})

router.get("/all", verifyToken, (req, res)=>{ 

    switch(statusCode){

        case 200:
            const getAllOrder=`SELECT orders.id, order_id,topic, status, date_deadline, first_name,last_name FROM orders RIGHT JOIN users ON orders.created_by=uuid WHERE uuid=${tokenInfo.uuid}`;

            dbConnection.query(getAllOrder, (err, result)=>{
        
                if(err){
                    console.log(err);
                }
                
                let userInfo={
                    name:`${result[0].first_name} ${result[0].last_name}`, 
                    allOrders:result[0].id==null?0:result.length,
                    activeOrders:getOrderStatus("Active", result).length,
                    cancelledOrders:getOrderStatus("Cancelled", result).length,
                    completedOrders:getOrderStatus("Completed", result).length,
                    orders:result[0].id==null?[]:result
                }
        
                res.send(userInfo);
            })

            break;
        
        case 401:
            res.sendStatus(401);
    
            break;
    
        case 403:
            res.sendStatus(403);
    
            break;
    }
});

router.post("/new", verifyToken, (req, res)=>{

    switch(statusCode){
        case 200:

            res.sendStatus(200);
            
            const form=new formidable.IncomingForm();

            const rootPath=(path.dirname(__dirname));

            form.parse(req, (err, fields, files)=>{

                if(err){
                    console.log(err);
                }

                const folder=`folder${generateId(100000)}`

                if(files.attachedFiles){

                    fs.mkdir(path.join(rootPath, "public", "files", folder), (err)=>{

                        if(err){
                            console.log(err);
                        }
                    });

                    for(let i=0; i<files.attachedFiles.length; i++){

                        const file=files.attachedFiles[i];

                        const oldpath=file.filepath;

                        const newPath=`${path.join(rootPath, "public", "files", folder)}/${file.originalFilename}`;
                                                
                        fs.readFile(oldpath, (err, data)=>{

                            if(err){
                                console.log(err)
                            }

                            fs.writeFile(newPath, data, (err)=>{

                                if(err){
                                    console.log(err);
                                }
                            })
                        });
                    }
                }

                const {gradeLevel, subject, instructions, pagesOrwords, amount, deadline, time, sources, style, topic}=fields;

                let orderId=generateId(100000000);

                let status='Active';

                let createdBy=tokenInfo.uuid;

                files=files.attachedFiles?folder:"";

                const orderDetails=[
                    orderId,
                    createdBy,
                    subject[0],
                    gradeLevel[0],
                    style[0],
                    sources[0],
                    files,
                    instructions[0],
                    topic[0],
                    pagesOrwords[0],
                    amount[0],
                    deadline[0],
                    time[0],
                    status
                ];

                const createOrder="INSERT INTO orders (order_id, created_by, subject, level, ref_style, sources, files, instructions, topic, words_or_pages, amount, date_deadline, time_deadline, status) VALUES (?)";

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

} );

router.post("/revision", verifyToken, (req, res)=>{

    switch(statusCode){

        case 200:
            const {orderId, modificationType, modificationReason}=req.body;

            let modification_id=generateId(100000000);
            let order_id=orderId;
            let type=modificationType;
            let reason=modificationReason

            let orderModifications=[
                modification_id,
                order_id,
                type,
                reason
            ];

            const modifyOrder=`INSERT INTO orderModification (modification_id, order_id, modification_type, reason) VALUES (?)`;

            dbConnection.query(modifyOrder, [orderModifications], (err, result)=>{

                if(err){
                    console.log(err);
                }else{
                    res.sendStatus(200);
                }

                
            })

            break;

        case 401:
            res.sendStatus(401);

            break;

        case 403:
            res.sendStatus(403);

            break;
    }
  
});


router.post("/order/send/:id/", verifyToken, (req, res) => {
    
    switch (statusCode){

        case 200:

            if (tokenInfo.role === "Admin") {

                const form = new formidable.IncomingForm();

                const rootPath=(path.dirname(__dirname));

                form.parse(req, (err, fields, files) => {
                    
                    if (err) {
                        console.log(err);
                    }

                    const folder = `folder${generateId(100000)}`;

                    fs.mkdir(path.join(rootPath, "public", "files", folder), (err)=>{

                        if(err){
                            console.log(err);
                        }
                    });

                    for(let i=0; i<files.documents.length; i++){

                        const file=files.documents[i];

                        const oldpath=file.filepath;

                        const newPath=`${path.join(rootPath, "public", "files", folder)}/${file.originalFilename}`;
                                                
                        fs.readFile(oldpath, (err, data)=>{

                            if(err){
                                console.log(err)
                            }

                            fs.writeFile(newPath, data, (err)=>{

                                if(err){
                                    console.log(err);
                                }
                            })
                        });
                    }

                    const { email, id, topic, additionalInfo, fileNames } = fields;

                    const attachments = [];

                    for (let i = 0; i < fileNames.length; i++){

                        attachments.push({
                            filename: fileNames[i],
                            path:`${path.join(rootPath, "public", "files", folder)}/${fileNames[i]}`
                        });
                    }

                    const mailOptions = {
                        from: senderEmail,
                        to: email[0],
                        subject: `Order${id[0]} - ${topic[0]}`,
                        text: `Dear customer, the above referenced order has been completed and is attached in this mail. Kindly go through it to 
                        confirm that it meets your requirements and standards. Incase of any changes, you have up to 7 days to request a revision, for free.
                        Please note that at the elapse of this period (7 days), you will no longer be able to request a revision for this work
                        ${additionalInfo[0]===""?"":additionalInfo[0]}` ,
                        attachments:attachments
                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        
                        if (err) {
                            console.log(err);
                        } else {
                            
                            const insert = `INSERT INTO sentOrders (transaction_id, order_id, files, additionalMessage, timestamp) VALUES (?)`;

                            const transactionId = generateId(100000);

                            const sentOrderDetails = [
                                transactionId,
                                id[0],
                                folder,
                                additionalInfo[0],
                                new Date()
                            ]

                            dbConnection.query(insert, [sentOrderDetails], (err, result) => {
                                
                                if (err) {
                                    console.log(err);
                                }

                                res.sendStatus(200)
                            })
                        }
                    })
                })
            } else {
                res.sendStatus(401);
            }

            break;

        case 401:
            res.sendStatus(401);

            break;
        
        case 403:
            res.sendStatus(403);

            break;
    }
});

router.get("/order/dispatchTime/:id", verifyToken, (req, res)=>{

    switch (statusCode) {
        
        case 200:

            let getTime = `SELECT timestamp FROM sentOrders where order_id=?`;

            dbConnection.query(getTime, req.params.id, (err, result)=>{

                if(err){
                    res.sendStatus(401);
                }

                if (result.length) { 
                    res.json({
                        code:200,
                        message:result[0].timestamp
                    })
                } else {
                    res.json({
                        code:404,
                        message:"This order has not yet been sent to you. Kindly wait until it is sent before you request a revision"
                    })
                }

            })

            break;

        case 401:
            res.sendStatus(401);

            break;
        
        case 403:
            res.sendStatus(403);

            break;
    }
})

router.post("/cancel-order", verifyToken, (req, res)=>{


    switch(statusCode){

        case 200:

            res.sendStatus(200)

            break;

        case 401:
            res.sendStatus(401);

            break;

        case 403:
            res.sendStatus(403);

            break;
    }

});

module.exports=router;