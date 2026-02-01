import express from 'express';

const app = express();

const port = 3000;

app.get("/", (req, res)=>{
    return res.status(200).json({
        status: "healthy"
    })
})
app.listen(port, ()=>{
    console.log('listening at 3000')
})


//z9TpdOvKSN1GkBD6


