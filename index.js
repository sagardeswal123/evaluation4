const express = require('express');
const cors = require('cors');
const { connection } = require('./db');
const { userRouter } = require('./routes/user.router');
const { postRouter } = require('./routes/post.router');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users",userRouter);

app.use("/posts",postRouter);


app.listen(4500,async()=>{
    try {
        await connection;
        console.log(`listening on port ${process.env.port}`);
        console.log("db connected")
    } catch (error) {
        console.log({error:error.message});
    }
})