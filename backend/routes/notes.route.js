import express from 'express';
const router = express.Router();
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { Note } from '../models/notes.model.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// get all undeleted notes created by user
router.get('/', authMiddleware, async (req, res) => {
    let requestedNotes = '';
    try {
        requestedNotes = await Note.find({
        creator: req.user.userid,
        isdeleted: false
    }).sort({createdAt: -1})
    } catch (err) {
        logger.error(err)
        return res.status(500).json({
            message: 'something went wrong'
        })
    }

    if (requestedNotes.length == 0) {
        return res.status(200).json({
            message: 'You have no notes right now.'
        })
    }
    return res.status(200).json({
        requestedNotes
    })
    
});

// get all deleted notes
router.get('/bin', authMiddleware, async (req, res) => {
    let requestedNotes = '';
    try {
        requestedNotes = await Note.find({
        creator: req.user.userid,
        isdeleted: true
    }).sort({createdAt: -1})
    } catch (err) {
        logger.error(err)
        return res.status(500).json({
            message: 'something went wrong'
        })
    }

    if (requestedNotes.length == 0) {
        return res.status(200).json({
            message: 'You have no notes right now.'
        })
    }
    return res.status(200).json({
        requestedNotes
    })
    
});

router.post('/create', authMiddleware, async(req, res) => {
    const {title, content, tags} = req.body;
    try {
        await Note.create({
            title, content, tags,
            creator: req.user.userid
        })

    } catch (err) {
        logger.error(err)
        return res.status(500).json({
            message: 'something went wrong'
        })
    }

    return res.status(201).json({message: 'Note Created'})

});

// get a particular note, created by user
router.get('/:id', authMiddleware, async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({message: 'Invalid note ID'})
    }

    let requestedNote;
    try {
        requestedNote = await Note.findOne({
            _id: req.params.id,
            creator: req.user.userid
        })
        
    } catch (errs) {
        logger.error(errs)
        return res.status(500).json({message: 'something went wrong'})
    }

    if (requestedNote) {
        return res.status(200).json(requestedNote)
    }else{
        return res.status(404).json({message: "Can not find the requested note."})
    }
});

router.patch('/edit/:id', authMiddleware, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({message: "Invalid ID"});
    }
    const {title, content, tags} = req.body;

    try {
        const updatedNote = await Note.findOneAndUpdate({
            _id: req.params.id, creator: req.user.userid
        }, {
            $set: {title, content, tags}
        }, {
            new: true
        })

        if (!updatedNote) {
            return res.status(404).json({message: "Can not find requested note"})
        }

        return res.status(200).json(updatedNote)

    } catch (err) {
        logger.error(err);
        return res.status(500).json('something went wrong.')
    }
});

// soft delete
router.patch('/move-to-bin/:id', authMiddleware, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({message: "Invalid ID"});
    }

    try {
        const updatedNote = await Note.findOneAndUpdate({
            _id: req.params.id, creator: req.user.userid
        }, {
            $set: {isdeleted: true}
        }, {
            new: true
        })

        if (!updatedNote) {
            return res.status(404).json({message: "Can not find requested note"})
        }

        return res.status(200).json({message: "Note moved to bin."})

    } catch (err) {
        logger.error(err);
        return res.status(500).json('something went wrong.')
    }
});

// permanent delete
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({message: "Invalid ID"})
    }

    try {
        const deletedNote = await Note.findOneAndDelete({
            _id: req.params.id, creator: req.user.userid
        })

        if (deletedNote) {
            return res.status(200).json({message: "Note has been deleted"})
        }
        return res.status(404).json({message: "Can not find requested note."})

    } catch (err) {
        logger.error(err)
        return res.status(500).json({message: "Something went wrong."})
    }

});

export default router;