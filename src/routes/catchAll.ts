import express from 'express'
import logger from "../lib/logger";

export default function (router: express.Router) {
    router.all(
        '*', 
        function catchAllEndpoint (req, res) {
            logger.info(`Bad Route Request received: ${req.method} ${req.url} params:${JSON.stringify(req.params)}`)
            const error = {
                status: '404',
                message: 'Route not found', 
                method: req.method, 
                url: req.url
            }
            return res.status(404).send(error)
        }
    )

    return router
}
