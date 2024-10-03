import express , {   Request , Response  ,NextFunction} from "express";
import { connectTodb } from "./db/connect";
import { createUser , createTodos} from "./models/model";
import mainRouter from "./routes/index"
import exp from "constants";

const app = express()
const port = 3002

app.use("/api", (req : Request , res : Response , next : NextFunction)=>{

    if (req.method === "PUT" || req.method === "POST"){
        express.json()(req , res , next)
    }else{
        next()
    }
})

connectTodb()

//createUser()
//createTodos()

app.use("/api", mainRouter)

app.get("/", (req:Request , res : Response)=>{
    res.send("hello form the typescript")
})

app.listen(port , ()=>{
    console.log(`server  running on mon ${port}`)
})