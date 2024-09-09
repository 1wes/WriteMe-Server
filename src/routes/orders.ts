import express, { Request, Response, NextFunction } from "express";
import path from "path";
import verifyToken from "../middleware/cookie-validation";
import formidable from "formidable";
import fs from "fs";
import generateId from "../utils/generateId";
import transporter from "../utils/mail";
import envConfig from "../env-config";
import { OrderDetails, Orders } from "../types/interface";
import db from "../utils/prisma";

const router = express.Router();

const { senderEmail } = envConfig;

router.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

interface Order {
  status: string;
}

const getOrderStatus = (status: string, result: Order[]): Order[] => {
  return result.filter((orders: Order) => orders.status === status);
};

router.get("/admin", verifyToken, async (req: Request, res: Response) => {

  const { tokenInfo } = req;

  if (tokenInfo.role === "Admin") {

    const username = `${tokenInfo.firstName} ${tokenInfo.lastName}`;

    try {
      let ordersWithUserDetails = await db.order.findMany({
        orderBy: {
          id: "desc",
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
  
      const orders: Orders = {
        username: username,
        totalOrders: ordersWithUserDetails?.length,
        allActiveOrders: getOrderStatus("Active", ordersWithUserDetails).length,
        allCancelledOrders: getOrderStatus("Cancelled", ordersWithUserDetails).length,
        allCompletedOrders: getOrderStatus("Completed", ordersWithUserDetails).length,
        allOrders: ordersWithUserDetails.length === 0 ? [] : ordersWithUserDetails,
      };
  
      res.send(orders);
    }catch(err){

      console.log(err);
      res.sendStatus(500);
    }
  } else {
    return res.sendStatus(401);
  }
});

// router.get("/order/:id", verifyToken, (req: Request, res: Response) => {
//   const { statusCode, tokenInfo } = req;

//   switch (statusCode) {
//     case 200:
//       if (tokenInfo.role === "Admin") {
//         const id: string = req.params.id;

//         const username: string = `${tokenInfo.firstName} ${tokenInfo.lastName}`;

//         const row = `SELECT orders.*, first_name, last_name, email from orders RIGHT JOIN users on created_by=uuid where order_id=?`;

//         const attachments: any = [];

//         dbConnection.query(row, id, (err, result) => {
//           if (err) {
//             console.log(err);
//           }

//           let order: {};

//           if (result[0].files) {
//             attachments.push(result[0].files);

//             fs.readdir(
//               path.join(
//                 path.dirname(__dirname),
//                 "public",
//                 "files",
//                 result[0].files
//               ),
//               (err, data) => {
//                 order = {
//                   ...result[0],
//                   username: username,
//                   attachedFiles: attachments,
//                   fileNames: data,
//                 };

//                 res.send(order);
//               }
//             );
//           } else {
//             order = {
//               ...result[0],
//               username: username,
//               attachedFiles: attachments,
//             };
//             res.send(order);
//           }
//         });
//       } else {
//         return res.sendStatus(401);
//       }

//       break;

//     case 401:
//       res.sendStatus(401);

//       break;

//     case 403:
//       res.sendStatus(403);

//       break;
//   }
// });

// router.get(
//   "/order/files/:folder/:fileName",
//   verifyToken,
//   (req: Request, res: Response) => {
//     const { statusCode, tokenInfo } = req;

//     switch (statusCode) {
//       case 200:
//         if (tokenInfo.role === "Admin") {
//           const rootPath = path.dirname(__dirname);

//           const filePath = path.join(
//             rootPath,
//             "public",
//             "files",
//             req.params.folder
//           );

//           const file = path.join(filePath, req.params.fileName);

//           res.sendFile(file);
//         } else {
//           res.sendStatus(401);
//         }

//         break;

//       case 401:
//         res.sendStatus(401);

//         break;

//       case 403:
//         res.sendStatus(403);

//         break;
//     }
//   }
// );

// router.put(
//   "/order/update/:orderId",
//   verifyToken,
//   (req: Request, res: Response) => {
//     const { statusCode, tokenInfo } = req;

//     switch (statusCode) {
//       case 200:
//         if (tokenInfo.role === "Admin") {
//           let { status } = req.body;

//           let { orderId } = req.params;

//           const updateStatement = `UPDATE orders SET status='${status}' WHERE order_id=?`;

//           dbConnection.query(updateStatement, orderId, (err) => {
//             if (err) {
//               console.log(err);
//             } else {
//               res.sendStatus(200);
//             }
//           });
//         } else {
//           res.sendStatus(401);
//         }

//         break;

//       case 401:
//         res.sendStatus(401);

//         break;

//       case 403:
//         res.sendStatus(403);

//         break;
//     }
//   }
// );

router.get("/all", verifyToken, async (req: Request, res: Response) => {
  const { statusCode, tokenInfo } = req;

  switch (statusCode) {
    case 200:
      try {
        let userWithOrders = await db.user.findUnique({
          where: {
            uuid: tokenInfo.uuid,
          },
          select: {
            firstName: true,
            lastName: true,
            orders: {
              select: {
                id: true,
                orderId: true,
                topic: true,
                status: true,
                dateDeadline: true,
              },
            },
          },
        });

        const orders = userWithOrders?.orders || [];

        let userInfo = {
          name: `${userWithOrders?.firstName} ${userWithOrders?.lastName}`,
          allOrders: orders.length,
          activeOrders: getOrderStatus("Active", orders).length,
          cancelledOrders: getOrderStatus("Cancelled", orders).length,
          completedOrders: getOrderStatus("Completed", orders).length,
          orders: orders,
        };

        res.send(userInfo);
      } catch (err) {
        console.log(err);
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

// router.post("/new", verifyToken, (req: Request, res: Response) => {
//   const { statusCode, tokenInfo } = req;

//   switch (statusCode) {
//     case 200:
//       const form = new formidable.IncomingForm();

//       const rootPath = path.dirname(__dirname);

//       form.parse(req, (err, fields, files: formidable.Files) => {
//         if (err) {
//           console.log(err);
//         }

//         const folder = `folder${generateId(100000)}`;

//         if (files.attachedFiles) {
//           // create folder to store attached files
//           fs.mkdir(path.join(rootPath, "public", "files", folder), (err) => {
//             if (err) {
//               console.log(err);
//             }
//           });

//           for (let i = 0; i < files.attachedFiles.length; i++) {
//             const file = files.attachedFiles[i];

//             const oldpath = file.filepath;

//             const newPath = `${path.join(
//               rootPath,
//               "public",
//               "files",
//               folder
//             )}/${file.originalFilename}`;

//             // store the file in created folder
//             fs.readFile(oldpath, (err, data) => {
//               if (err) {
//                 console.log(err);
//               }

//               fs.writeFile(newPath, data, (err) => {
//                 if (err) {
//                   console.log(err);
//                 }
//               });
//             });
//           }
//         }

//         const {
//           service,
//           gradeLevel,
//           subject,
//           instructions,
//           pagesOrwords,
//           amount,
//           deadline,
//           time,
//           sources,
//           style,
//           topic,
//           language,
//         } = fields as formidable.Fields;

//         let orderId = generateId(100000000);

//         let status = "Active";

//         let createdBy = tokenInfo?.uuid;

//         let newFiles = files.attachedFiles ? folder : "";

//         let orderDetails: OrderDetails = [
//           orderId,
//           createdBy,
//           service ? service[0] : "",
//           subject ? subject[0] : "",
//           gradeLevel ? gradeLevel[0] : "",
//           style ? style[0] : "",
//           language ? language[0] : "",
//           sources ? sources[0] : "",
//           newFiles,
//           instructions ? instructions[0] : "",
//           topic ? topic[0] : "",
//           pagesOrwords ? pagesOrwords[0] : "",
//           amount ? amount[0] : "",
//           deadline ? deadline[0] : "",
//           time ? time[0] : "",
//           status,
//         ];

//         const createOrder =
//           "INSERT INTO orders (order_id, created_by, service, subject, level, ref_style, language, sources, files, instructions, topic, words_or_pages, amount, date_deadline, time_deadline, status) VALUES (?)";

//         dbConnection.query(createOrder, [orderDetails], (err) => {
//           if (err) {
//             console.log(err);
//           }

//           res.sendStatus(200);
//         });
//       });
//       break;

//     case 401:
//       res.sendStatus(401);

//       break;

//     case 403:
//       res.sendStatus(403);

//       break;
//   }
// });

// router.post("/revision", verifyToken, (req: Request, res: Response) => {
//   const { statusCode } = req;

//   switch (statusCode) {
//     case 200:
//       const { orderId, modificationType, modificationReason } = req.body;

//       let modification_id = generateId(100000000);
//       let order_id = orderId;
//       let type = modificationType;
//       let reason = modificationReason;

//       let orderModifications = [modification_id, order_id, type, reason];

//       const modifyOrder = `INSERT INTO orderModification (modification_id, order_id, modification_type, reason) VALUES (?)`;

//       dbConnection.query(modifyOrder, [orderModifications], (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.sendStatus(200);
//         }
//       });

//       break;

//     case 401:
//       res.sendStatus(401);

//       break;

//     case 403:
//       res.sendStatus(403);

//       break;
//   }
// });

// router.post("/order/send/:id/", verifyToken, (req: Request, res: Response) => {
//   const { statusCode, tokenInfo } = req;

//   const revisionGracePeriod = (dispatchTime: Date): number => {
//     const gracePeriod = dispatchTime.getTime() + 1000 * 3600 * 24 * 7;

//     return gracePeriod;
//   };

//   switch (statusCode) {
//     case 200:
//       if (tokenInfo.role === "Admin") {
//         const form = new formidable.IncomingForm();

//         const rootPath = path.dirname(__dirname);

//         form.parse(
//           req,
//           (err, fields: formidable.Fields, files: formidable.Files) => {
//             if (err) {
//               console.log(err);
//             }

//             const folder = `folder${generateId(100000)}`;

//             fs.mkdir(path.join(rootPath, "public", "files", folder), (err) => {
//               if (err) {
//                 console.log(err);
//               }
//             });

//             // check whether there documents are an array
//             if (files && Array.isArray(files.documents)) {
//               for (let i = 0; i < files.documents.length; i++) {
//                 const file = files.documents[i];

//                 const oldpath = file.filepath;

//                 const newPath = `${path.join(
//                   rootPath,
//                   "public",
//                   "files",
//                   folder
//                 )}/${file.originalFilename}`;

//                 fs.readFile(oldpath, (err, data) => {
//                   if (err) {
//                     console.log(err);
//                   }

//                   fs.writeFile(newPath, data, (err) => {
//                     if (err) {
//                       console.log(err);
//                     }
//                   });
//                 });
//               }
//             }

//             const { email, id, topic, additionalInfo, fileNames } = fields;

//             const attachments = [];

//             // assert that fileNames is an array
//             if (fileNames && Array.isArray(fileNames)) {
//               for (let i = 0; i < fileNames?.length; i++) {
//                 attachments.push({
//                   filename: fileNames[i],
//                   path: `${path.join(rootPath, "public", "files", folder)}/${
//                     fileNames[i]
//                   }`,
//                 });
//               }
//             }

//             const dispatchTime = new Date(Date.now());

//             const gracePeriod = revisionGracePeriod(dispatchTime);

//             const mailOptions = {
//               from: senderEmail,
//               to: email?.[0],
//               subject: `Order${id?.[0]} - ${topic?.[0]}`,
//               text: `Dear customer, the above referenced order has been completed and is attached in this mail. Kindly go through it to
//                         confirm that it meets your requirements and standards. Incase of any changes, you have up to 7 days (${new Date(
//                           gracePeriod
//                         ).toUTCString()})
//                         to request a revision, for free. Please note that at the elapse of this period (7 days), you will no longer be able to request a revision for this work. ${
//                           additionalInfo?.[0] === "" ? "" : additionalInfo?.[0]
//                         }`,
//               attachments: attachments,
//             };

//             transporter.sendMail(mailOptions, (err, info) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 const insert = `INSERT INTO sentOrders (transaction_id, order_id, files, additionalMessage, timestamp) VALUES (?)`;

//                 const transactionId = generateId(100000);

//                 const sentOrderDetails = [
//                   transactionId,
//                   id?.[0],
//                   folder,
//                   additionalInfo?.[0],
//                   dispatchTime,
//                 ];

//                 dbConnection.query(
//                   insert,
//                   [sentOrderDetails],
//                   (err, result) => {
//                     if (err) {
//                       console.log(err);
//                     }

//                     res.sendStatus(200);
//                   }
//                 );
//               }
//             });
//           }
//         );
//       } else {
//         res.sendStatus(401);
//       }

//       break;

//     case 401:
//       res.sendStatus(401);

//       break;

//     case 403:
//       res.sendStatus(403);

//       break;
//   }
// });

// router.put(
//   "/order/update/files/:id",
//   verifyToken,
//   (req: Request, res: Response) => {
//     const { statusCode } = req;

//     switch (statusCode) {
//       case 200:
//         const form = new formidable.IncomingForm();

//         form.parse(req, (err, fields, files: formidable.Files) => {
//           if (err) {
//             console.log(err);
//           }

//           const checkFileFolder = `SELECT (files) FROM orders WHERE order_id=?`;

//           dbConnection.query(checkFileFolder, req.params.id, (err, result) => {
//             if (err) {
//               console.log(err);
//             }

//             if (result[0].files === "") {
//               const rootPath = path.dirname(__dirname);

//               const folder = `folder${generateId(100000)}`;

//               fs.mkdir(
//                 path.join(rootPath, "public", "files", folder),
//                 (err) => {
//                   if (err) {
//                     console.log(err);
//                   }
//                 }
//               );

//               // assert that additionalFiles is an array
//               if (files && Array.isArray(files.additionalFiles)) {
//                 for (let i = 0; i < files.additionalFiles.length; i++) {
//                   const currentFile = files.additionalFiles[i];

//                   const oldPath = currentFile.filepath;

//                   const newPath = `${path.join(
//                     rootPath,
//                     "public",
//                     "files",
//                     folder
//                   )}/${currentFile.originalFilename}`;

//                   fs.readFile(oldPath, (err, data) => {
//                     if (err) {
//                       console.log(err);
//                     }

//                     fs.writeFile(newPath, data, (err) => {
//                       if (err) {
//                         console.log(err);
//                       }
//                     });
//                   });
//                 }
//               }

//               const updateFiles = `UPDATE orders SET files=? WHERE order_id=${req.params.id}`;

//               dbConnection.query(updateFiles, folder, (err) => {
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   res.sendStatus(200);
//                 }
//               });
//             } else {
//               const rootPath = path.dirname(__dirname);

//               const filesFolder = result[0].files;

//               if (files && Array.isArray(files.additionalFiles)) {
//                 for (let i = 0; i < files.additionalFiles.length; i++) {
//                   const currentFile = files.additionalFiles[i];

//                   const oldPath = currentFile.filepath;

//                   const newPath = `${path.join(
//                     rootPath,
//                     "public",
//                     "files",
//                     filesFolder
//                   )}/${currentFile.originalFilename}`;

//                   fs.readFile(oldPath, (err, data) => {
//                     if (err) {
//                       console.log(err);
//                     }

//                     fs.writeFile(newPath, data, (err) => {
//                       if (err) {
//                         console.log(err);
//                       }
//                     });
//                   });
//                 }
//               }

//               res.sendStatus(200);
//             }
//           });
//         });

//         break;

//       case 401:
//         res.sendStatus(401);

//         break;

//       case 403:
//         res.sendStatus(403);

//         break;
//     }
//   }
// );

// router.get(
//   "/order/dispatchTime/:id",
//   verifyToken,
//   (req: Request, res: Response) => {
//     const { statusCode } = req;

//     switch (statusCode) {
//       case 200:
//         let getTime = `SELECT timestamp FROM sentOrders where order_id=?`;

//         dbConnection.query(getTime, req.params.id, (err, result) => {
//           if (err) {
//             res.sendStatus(401);
//           }

//           if (result.length) {
//             res.json({
//               code: 200,
//               message: result[0].timestamp,
//             });
//           } else {
//             res.json({
//               code: 404,
//               message:
//                 "This order has not yet been sent to you. Kindly wait until it is sent before you request a revision",
//             });
//           }
//         });

//         break;

//       case 401:
//         res.sendStatus(401);

//         break;

//       case 403:
//         res.sendStatus(403);

//         break;
//     }
//   }
// );

router.post("/cancel-order", verifyToken, (req: Request, res: Response) => {
  // order cancellation logic
});

export default router;
