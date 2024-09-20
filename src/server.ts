import express from 'express';

import config from './env-config';
import cors from 'cors';
import ordersAPI from './routes/orders';
import clients from "./routes/users";
import cookieParser from 'cookie-parser';

const app = express();

const { port, client_origin } = config;

app.use(express.json());
app.use(express.urlencoded({extended:true as boolean}));
app.use(cors({
    origin:client_origin as string,
    credentials:true as boolean
}));
app.use(cookieParser());

app.use("/api/orders", ordersAPI);
app.use("/api/user", clients);

app.listen(port, ()=>{
    console.log(`[⚡]:Server is running at port ${port}`);
});
