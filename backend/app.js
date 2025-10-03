import express, { urlencoded } from 'express';
const app = express();

import dotenv from "dotenv";
dotenv.config();



import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.use('/auth', authRoute);

export default app;
