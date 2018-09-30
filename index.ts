import app from "./app/lib/app"
import logger from "./app/lib/logger"
import mongoose from "mongoose"

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/no-spoilers'

mongoose.connect(mongoUri, { useNewUrlParser: true })
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    logger.info(`Connected to mongodb!`)

    const port: Number = Number(process.env.PORT) || 3000

    app.listen(port, (err: string) => {
        if (err) {
            return logger.error(err)
        }
  
        return logger.info(`Listening on port ${port}...`)
    })
});
