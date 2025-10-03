import mongoose, { mongo } from "mongoose";

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    tags: {
        type: [String],
        default: []
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export const Note = mongoose.model('Note', notesSchema);