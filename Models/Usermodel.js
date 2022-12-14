const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const userModel=mongoose.model('registration',userSchema);
module.exports=userModel;