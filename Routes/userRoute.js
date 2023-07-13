// Importing External Packages

const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require('dotenv').config()

// Importing Model

const {UserModel}=require("../Models/UserModel.js")

// ...............................................................
const UserRoute =express.Router()


// ..................Register User.............

UserRoute.post("/signup",async(req,res)=>{
    const {email,password}=req.body
    try {
        let isUser=await UserModel.findOne({email})
        if(isUser){
            res.status(401).send({msg:"User Already Registered With the provided Email,plz login"})
            return
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        let user=new UserModel({email,password:hashedPassword})
        await user.save()    
        res.status(201).send({msg:"User Registered Successfully"})

    } catch (error) {
        console.log(error)
        res.status(501).send({msg:"Server Error",error:error.message})
        
    }
})


// .........................Login User...........................

UserRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {

        let user=await UserModel.findOne({email})
        if(!user){
            res.status(401).send({msg:"No User Registered With the provided Email,plz sign up"})
            return
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
                var token = jwt.sign({ user: email }, process.env.JwtKey);
                res.status(201).send({msg:"Login Successful",token})
            }else{
                console.log(err)
                res.status(401).send({msg:"Password Incorrect"})
            }
        });
    } catch (error) {
        console.log(error)
        res.status(501).send({msg:"Server Error",error:error.message})
    }
})



module.exports={
    UserRoute
}