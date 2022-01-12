require("dotenv").config();
require("express-async-errors");
const morgan= require("morgan");
const express= require("express");
const app= express();

//db
const connectDB=require("./db/connect")

//routers
const authRouter=require("./routes/auth");


//middlewares
const errorMiddleware=require("./middleware/error-handler")
const notFoundMiddleware=require("./middleware/not-found")

app.use(express.json());
app.use(morgan("tiny"))

app.get("/",(req,res)=>{
    res.send("welcome to page")
})

app.use("/api/v1/auth",authRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port= process.env.PORT||5000;
const start= async ()=>{
    try{
      await connectDB(process.env.MONGO_URI)
      app.listen(port,()=>{
          console.log(`listening on port ${port}...`)
      })
    }
    catch(error){
        console.log(error);
    }
}

start();