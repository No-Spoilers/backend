import express from 'express'
import logger from "../lib/logger";
import { User as UserModel } from '../models/user';
import bodyParser from 'body-parser'
import endpoints from '../config/routes';
import jwt from 'jsonwebtoken';

function getTokenSecret () {
    if (process.env.NODE_ENV === 'test') return 'test-secret'
    if (process.env.TOKEN_SECRET) return process.env.TOKEN_SECRET
    throw new Error('Token Secret missing!')
}

export default function setupRoutes (router: express.Router) {
    router.post(
        endpoints.POST_LOGIN,
        bodyParser.json(),
        async function postLoginEndpoint (req, res) {
            try {
                logger.info(`POST_LOGIN Request received`)
                logger.info(`req.body: ${JSON.stringify(req.body)}`)
                const userFound = await UserModel.findOne({userName: req.body.userName})
                if (!userFound) {
                    return res.status(401).send();
                }
                logger.info(`User find result: ${JSON.stringify(userFound, null, 2)}`)
                if (!userFound.comparePassword(req.body.password)) {
                    return res.status(401).send();
                }
                const token = jwt.sign(userFound.userId, getTokenSecret());
        
                return res.status(200).send({token})
            } catch(error) {
                logger.error(error)
                return res.status(400).send({error})
            }
        }
    )

    return router
}
