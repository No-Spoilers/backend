import app from "./app/lib/app"
import logger from "./app/lib/logger"
import mongoose from "mongoose"

const connectionUri = process.env.MONGODB_URI || 'mongodb://localhost/no-spoilers'

mongoose.connect(connectionUri)
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    logger.info(`Connected to mongodb!`)

    const port: Number = process.env.PORT || 3000

    app.listen(port, (err: String) => {
        if (err) {
            return logger.error(err)
        }
  
        return logger.info(`Listening on port ${port}...`)
    })
});
