const express = require("express");

const userRouter = express.Router();
const {userModel} = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../model/blacklist.model")

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married} = req.body;
    const alreadyRegistered = await userModel.findOne({email});
    if(alreadyRegistered){
        res.json({msg:"User already exist, please login"})
    }
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.json({msg:err.message});
            }
            else{
                const user = new userModel({name,email,gender,password:hash,age,city,is_married});
                await user.save();
                res.json({msg:"user registered successfully",user:req.body});
            }
        })
    } catch (error) {
        res.json({error:error.message});
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    let token = jwt.sign({userID:user._id},"masai",{ expiresIn: '7d' });
                    res.json({msg:"logged in successfully",token})
                }
                else{
                    res.json({msg:"wrong credentials"})
                }
            })
        }
        else{
            res.json({msg:"user not exist"})
        }
    } catch (error) {
        res.json({error:error.message});
    }
})

userRouter.get("/logout",async(req,res)=>{
    try{
        const token=req.headers.auth.split(" ")[1]
        const existingToken= await BlackListModel.findOne({token:token})
        if(!existingToken){
          const blacklistToken=new BlackListModel({token:token,expireAt:new Date(Date.now()+ 7*24*60*60*1000)})
          await blacklistToken.save()
          await BlackListModel.deleteMany({expireAt:{$lte:new Date()}})
          res.status(200).json({msg:"user logout"})
        }
        else{
            res.status(200).json({msg:"user already logout"})
        }
    }
    catch(err){
        res.status(400).json({err:err.message})
    }
    
})

module.exports = {
    userRouter
}

//     name : String,
//     email : String,
//     gender : String,
//     password : String,
//     age : Number,
//     city : String,
//     is_married : Boolean