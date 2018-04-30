import app from "./app/lib/app";
import logger from "./app/lib/logger";

const port = process.env.PORT || 3000

app.listen(port, (err: String) => {
    if (err) {
        return logger.error(err)
    }

    return logger.info(`Listening on port ${port}...`)
})
