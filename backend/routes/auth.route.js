import express from "express";
const router = express.Router();
import logger from "../utils/logger.js";
import {body, validationResult} from "express-validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { user } from "../models/user.model.js";

router.post('/signup',
    body('email').trim().isEmail().withMessage('Invalid Email'),
    body('password').trim().isStrongPassword().withMessage('Password must be at least 8 chars, include uppercase, lowercase, number, and symbol'),
    async (req, res) => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
            logger.warn({'Errors': errs.array()}, 'Validation Failed.')
            return res.status(400).json({
                message: 'Invalid Data',
                errors: errs.array()
            })
        }

        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        const newuser = await user.create({
            name,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            userid: newuser._id,
            email: newuser.email
        }, process.env.JWT_SECRET);

        res.cookie('token', token);
        logger.info({'userId': newuser._id}, 'New user regietered')

        return res.status(200).json({
            message: 'Registeration is Successful.'
        })
})


router.post('/login',
    body('email').trim().isEmail().withMessage('Invalid Email'),
    body('password').trim().isStrongPassword().withMessage('Password must be at least 8 chars, include uppercase, lowercase, number, and symbol'),
    async(req, res) => {
        const errs = await validationResult(req);
        if (!errs.isEmpty()) {
            logger.warn({"Error": errs.array()}, 'Validation Failed')
            return res.status(400).json({
                message: "Invalid Data",
                errors: errs.array()
            })
        }

        const {email, password} = req.body;

        const existingUser = await user.findOneAndUpdate({
            email
        },{
            $set: {lastLogin: new Date()}
        },{
            new: true
        })
        if (!existingUser) {
            logger.warn('user not found')
            return res.status(400).json({
                message: "Incorrect Email or Password"
            })
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        console.log(`match pw: ${matchPassword}`)
        if (!matchPassword) {
            logger.warn('password does not match.')
            return res.status(400).json({
                message: "Incorrect Email or Password"
            })
        }

        const token = jwt.sign({
            userid: existingUser._id,
            email: existingUser.email
        }, process.env.JWT_SECRET);

        res.cookie('token', token);

        logger.info({'userId': existingUser._id.toString(), 'logined at: ':existingUser.lastLogin}, 'User logined')

        return res.status(200).json({
            message: 'Login is Successful.'
        })

})
export default router;