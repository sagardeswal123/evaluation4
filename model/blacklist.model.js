const  mongoose=require("mongoose")

const blacklistSchema=mongoose.Schema(
    {
        token:String,
        exprireAt:Date,
    },{
        versionKey : false
    }
)

const BlackListModel=mongoose.model("blacklist",blacklistSchema)

module.exports={
    BlackListModel
}