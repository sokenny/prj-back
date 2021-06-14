import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = (req, res) => {
    res.send('THIS WORKS')
}

export const createPost = async(req, res) =>{

    const post = req.body;
    const newPost = new PostMessage(post);

    try{
        await newPost.save();
        res.status(201).json(newPost)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}