import mongoose from 'mongoose'

const postSchema = mongoose.Schema({

    title: String,
    message: String,
    creator: String,
    createdAt: {
        type: Date,
        default: new Date()
    }

})

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;