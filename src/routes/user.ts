import express from 'express'
import bodyParser from 'body-parser'
import uuidv4 from 'uuid/v4'

import logger from "../lib/logger"
import { User } from '../models/user'
import endpoints from '../config/routes'

export default function setupRoutes (router: express.Router) {
    router.get(
        endpoints.GET_USER_LIST, 
        async function getUserListEndpoint (req, res) {
            logger.info(`GET_USER_LIST Request received`)
            try {
                const findResult = await User.find({}).select('-passwordHash');
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
        async function getUserByIdEndpoint (req, res) {
            logger.info(`GET_USER_BY_ID Request received`)
            logger.info(`req.params: ${JSON.stringify(req.params)}`)
            try {
                const findResult = await User.findById(req.params.userId).select('-passwordHash');
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

            const newUser = new User({userId: newUserId, ...req.body})
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
