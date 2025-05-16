const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required:[true,'Email is required'],
        trim:true,
        unique:[true,"Email aready Exists"],
        minLength:[5,"Email must have 5 char"],
        lowercase:true,
    },
    password:
    {
        type:String,
        required:[true,'Password is required'],
        trim:true,
        select:false,
    },
    name: {
        type:String,
        required:[true,'Password is required'],
        trim:true,
        
    },
    verified:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type:String,
        select:false,

    },
    verificationCodeValidation:{
        type:String,
        select:false,

    },
    forgetPasswordCode:{
        type:String,
        select:false,

    },
    forgetPasswordCodeValidation:{
        type: Number,
        select:false,

    }

},{
    timestemps:true
});

module.exports = mongoose.model("User",userSchema)