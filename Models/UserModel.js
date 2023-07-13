// Importing External Packages

const mongoose=require("mongoose")

// .................User Schema.........................

const UserSchema=mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true}
})

// .................User Model.........................

const UserModel=mongoose.model("user",UserSchema)


module.exports={
    UserModel
}