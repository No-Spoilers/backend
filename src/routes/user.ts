import express from 'express'
import bodyParser from 'body-parser'
import uuidv4 from 'uuid/v4'

import logger from "../lib/logger"
import auth from "../lib/auth"
import { User as UserModel } from '../models/user'
import endpoints from '../config/routes'

export default function setupRoutes (router: express.Router) {
    router.get(
        endpoints.GET_USER_LIST,
        auth.tokenCheck,
        async function getUserListEndpoint (req, res) {
            logger.info(`GET_USER_LIST Request received`)
            if (!req.token.verified) {
                return res.status(400).send()
            }
            try {
                const findResult = await UserModel
                    .find({})
                    .select('-passwordHash')

                logger.info(`found: ${findResult.length} users`);
                return res.status(200).send(findResult);
            }
            catch (err) {
                res.status(500).send(err);
            }
        }
    )

    router.get(
        endpoints.GET_USER_BY_ID, 
        auth.tokenCheck,
        async function getUserByIdEndpoint (req, res) {
            logger.info(`GET_USER_BY_ID Request received`)
            if (!req.token || !req.token.verified) {
                return res.status(400).send()
            }
            try {
                logger.info('passed verification in GET_USER_BY_ID')
                const findResult = await UserModel
                    .findOne({userId: req.params.userId})
                    .select('-passwordHash')
                
                logger.info(`findResult: ${JSON.stringify(findResult, null, 2)}`);
                res.status(200).send(findResult);
            }
            catch (err) {
                res.status(500).send(err);
            }
        }
    )

    router.post(endpoints.POST_USER,
        bodyParser.json(),
        async function postUserEndpoint (req, res) {
            logger.info(`POST_USER Request received`)
            logger.info(`req.body: ${JSON.stringify(req.body)}`)
            const newUserId = uuidv4()

            const newUser = new UserModel({userId: newUserId, ...req.body})
            try {
                const result = await newUser.save();
                logger.info(`User create result: ${JSON.stringify(result, null, 2)}`);
                const { userId, userName, email, createdAt } = result
                res.status(201).send({ userId, userName, email, createdAt });
            }
            catch (err) {
                logger.error(err);
                res.status(400).send({ err });
            }
        }
    )

    return router
}
