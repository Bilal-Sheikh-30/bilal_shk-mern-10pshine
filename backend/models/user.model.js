import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    signupDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    status: {
        type: String,
        default: 'active'
    }
})

export const user = mongoose.model('user', userSchema);