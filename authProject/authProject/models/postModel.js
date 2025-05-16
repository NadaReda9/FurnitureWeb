const { required } = require('joi')
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title:{
        type:string,
        required:[true,'title is required'],
        trim:true,

    },
    description:{
        type:string,
        required:[true,'description is required'],
        trim:true,

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true})

module.exports = mongoose.model('Post',postSchema)