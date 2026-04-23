const express = require("express")
require('dotenv').config();
const mongoose = require("mongoose")
const app= express();
const cors = require('cors');
const urlRoutes = require("./routes/routes.js")

app.use(cors({
    origin:process.env.FRONTEND_URL,
   
}))
app.use(express.json())


app.use("/",urlRoutes)


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((error)=>{
    console.log("error occurred",error)
})
const PORT = process.env.PORT

app.listen(PORT, ()=>{
   console.log(`server is running on port ${PORT}`)
})