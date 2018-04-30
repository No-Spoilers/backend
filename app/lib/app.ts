import express from 'express'
import logger from './logger';

const ENDPOINT_ROOT = '/'

class App {
    public express: express.Application

    constructor () {
        this.express = express()
        this.mountRoutes()
    }

    private mountRoutes (): void {
        const router = express.Router()
        logger.info('defining endpoints')

        router.get(ENDPOINT_ROOT, function (req, res) {
            logger.info(`ENDPOINT_ROOT Request received`)
            res.send('Hello World')
        })

        this.express.use('/', router)        
    }
}

export default new App().express