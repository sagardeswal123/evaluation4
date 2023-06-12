const express = require('express');

const {postModel} = require("../model/post.model");
const { userRouter } = require('./user.router');
const { auth } = require('../middleware/auth.middleware');
const postRouter = express.Router();

postRouter.use(auth)

postRouter.post("/add",async(req,res)=>{
    const userID = req.body.userID;
    try {
        const { title, body, device, no_of_comments } = req.body;
        const post = new postModel({
          title,
          body,
          device,
          no_of_comments,
          userID: userID 
        });
        await post.save();
        res.json({ message: 'Post created successfully' });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
      }
})

  postRouter.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 3 } = req.query;
      const posts = await postModel.find().limit(limit).skip((page - 1) * limit);
      res.json({ posts });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  })

  postRouter.get('/filter', async (req, res) => {
    try {
      const { page = 1, limit = 3, user, min_comments, max_comments } = req.query;
      const filter = { user: req.body.userId };
      if (user) {
        filter.user = user;
      }
      if (min_comments) {
        filter.no_of_comments = { $gte: min_comments };
      }
      if (max_comments) {
        filter.no_of_comments = { ...filter.no_of_comments, $lte: max_comments };
      }
      const posts = await postModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);
      res.json({ posts });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  postRouter.get('/top', async (req, res) => {
    try {
      const { page = 1, limit = 3 } = req.query;
      const posts = await postModel.find({ user: req.body.userId })
        .sort('-no_of_comments')
        .skip((page - 1) * limit)
        .limit(limit);
      res.json({ posts });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  postRouter.patch("/update/:postID",async(req,res)=>{

    const postID = req.params.postID;
    const userIDofUserDoc = req.body.userID; 
    try {
        const post = await postModel.findOne({_id: postID});
        const userIDofNoteDoc = post.userID;
        if(userIDofUserDoc === userIDofNoteDoc){
            await postModel.findByIdAndUpdate({_id: postID},req.body);
            res.json({msg:"updated successfully",post:req.body})
        }
    } catch (error) {
        res.json({error:error})
    }
    
})

postRouter.delete("/delete/:postID",async(req,res)=>{
    const postID = req.params.postID;
    const userIDofUserDoc = req.body.userID; 
    try {
        const post = await postModel.findOne({_id: postID});
        const userIDofNoteDoc = post.userID;
        if(userIDofUserDoc === userIDofNoteDoc){
            await postModel.findByIdAndDelete({_id: postID},req.body);
            res.json({msg:"deleted successfully",note:req.body})
        }
    } catch (error) {
        res.json({error:error})
    }
})

module.exports = {
    postRouter
}