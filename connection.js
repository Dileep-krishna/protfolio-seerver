//1,import mongoose
const mongoose=require("mongoose")
const connectionString=process.env.DATABASE
mongoose.connect(connectionString).then(res=>{
    console.log("mongodb connect successfully");
    
}).catch(err=>{
    console.log(`mongodb connection failed due to ${err}`);
    
})