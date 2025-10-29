import express from "express";
const router = express.Router();
import logger from "../utils/logger.js";
import {body, validationResult} from "express-validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { user } from "../models/user.model.js";
import { errors } from "mongodb-memory-server";
import { authMiddleware } from "../middlewares/auth.middleware.js";

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
        let newuser = '';
        try {
            newuser = await user.create({
            name,
            email,
            password: hashedPassword
        })
        } catch (errs) {
            logger.error(errs)
            
            if (errs.code === 11000) {
                return res.status(400).json({
                    message: 'Email already exists'
                })
            }else{
                return res.status(500).json({
                    message: 'something went wrong'
                })
            }
        }


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

router.get('/me', authMiddleware,async(req, res) => {
    const loginedUser = await user.findById(req.user.userid).select('name email signupDate lastLogin');
    return res.status(200).json({
        user: loginedUser
    })
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully.' });
});

export default router;