const { BlackListModel } = require("../model/blacklist.model");
const jwt = require("jsonwebtoken");

const auth=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1]
   
        try{
            const tokenBlacklist=await BlackListModel.findOne({token:token})
            if(!tokenBlacklist){
            const decoded = jwt.verify(token,"masai");
            if(decoded){
                next()
            }
            else{
                res.status(404).json({msg:"token not recognised"})
            }
        }
            else{
                res.status(200).json({msg:"please login"})
            }
        }
        catch(err){
            res.status(400).json({err:err.message})
        }
    }
    
   

module.exports={
    auth
}