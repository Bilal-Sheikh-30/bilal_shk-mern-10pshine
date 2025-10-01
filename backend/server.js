import app from "./app.js";
import logger from "./utils/logger.js";
import connectDb from "./config/db.js"

connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server is running at ${PORT}`));
