import express from 'express'
import logger from './logger';
import itemRoutes from '../routes/item';

class ExpressApp {
    public app: express.Application
    private static _instance: ExpressApp

    constructor () {
        this.app = express()
        this.mountRoutes()
    }

    public static getInstance(): express.Application {
        if (!this._instance) {
            this._instance = new ExpressApp()
        }

        return this._instance.app
    }

    private mountRoutes (): void {
        let router: express.Router = express.Router()
        logger.info('defining endpoints')

        router = itemRoutes(router)
        // Add more route files here or automate

        this.app.use('/', router)
    }
}

export default ExpressApp.getInstance()
