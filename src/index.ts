import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env.js';
import connectToDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieParser());

app.get("/", (req, res)=>{
    return res.status(200).json({
        status: "healthy"
    })
})

app.listen(PORT, async ()=>{
    console.log(`listening at ${PORT} in ${NODE_ENV} mode`);
    connectToDB();
})


//z9TpdOvKSN1GkBD6


