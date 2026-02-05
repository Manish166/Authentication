import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { PORT } from './constants/env.js';

const app = express();
app.use(cors)
app.use(cookieParser())

const port = 3000;

app.get("/", (req, res)=>{
    return res.status(200).json({
        status: "healthy"
    })
})
app.listen(PORT, ()=>{
    console.log(`listening at ${PORT}`)
})


//z9TpdOvKSN1GkBD6


