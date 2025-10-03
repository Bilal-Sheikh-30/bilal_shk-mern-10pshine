import mongoose from "mongoose";
import logger from "../utils/logger.js";

function connect_to_db() {
    mongoose.connect(process.env.MONGO_URI).then(
        () => logger.info('Connected to db.')).catch(
        (err) => logger.error({err}, 'db connection error: ')
    );
}

export default connect_to_db;  