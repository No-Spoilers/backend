import express from 'express'
import logger from "../lib/logger";
import { User } from '../models/user';
import bodyParser from 'body-parser'
import endpoints from '../config/routes';

export default (function () {
    return function (router: express.Router) {
        router.get(endpoints.GET_USER_LIST, function (req, res) {
            logger.info(`GET_USER_LIST Request received`)
            User.find({}).select('-passwordHash')
                .then(findResult => {
                    logger.info(`found: ${findResult.length} users`)
                    res.status(200).send(findResult)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
            }
        )

        router.get(endpoints.GET_USER_BY_ID, function (req, res) {
            logger.info(`GET_USER_BY_ID Request received`)
            logger.info(`req.params: ${JSON.stringify(req.params)}`)
            User.findById(req.params.userId).select('-passwordHash')
                .then((findResult) => {
                    logger.info(`findResult: ${JSON.stringify(findResult, null, 2)}`)
                    res.status(200).send(findResult)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
            }
        )

        router.post(endpoints.POST_USER,
            bodyParser.json(),
            function (req, res) {
                logger.info(`POST_USER Request received`)
                logger.info(`req.body: ${JSON.stringify(req.body)}`)
                const newUser = new User(req.body)
                return newUser.save()
                    .then((result: any) => {
                        logger.info(`User create result: ${JSON.stringify(result, null, 2)}`)
                        
                        res.status(201).send({result})
                    })
                    .catch((err: any) => {
                        logger.error(err)
                        res.status(400).send({err})
                    })
            }
        )

        return router
    }
})()
