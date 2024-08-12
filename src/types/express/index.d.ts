import { Express } from "express-serve-static-core";
// extend the Request interface to include the tokenInfo property

declare module 'express-serve-static-core' {
    interface Request{
         tokenInfo:any
     }
}