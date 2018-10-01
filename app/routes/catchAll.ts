import express from 'express'
import logger from "../lib/logger";
import { User } from '../models/user';
import bodyParser from 'body-parser'
import endpoints from '../config/routes';

export default (function () {
    return function (router: express.Router) {
        router.all('*', function (req, res) {
            logger.info(`Bad Route Request received: ${req.method} ${req.url} params:${JSON.stringify(req.params)}`)
            const error = {
                status: '404',
                message: 'Route not found', 
                method: req.method, 
                url: req.url
            }
            res.status(404).send(error)
        })

        return router
    }
})()
