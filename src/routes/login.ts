import express from 'express'
import logger from "../lib/logger";
import { User as UserModel } from '../models/user';
import bodyParser from 'body-parser'
import endpoints from '../config/routes';

export default (function () {
    return function (router: express.Router) {
        router.post(endpoints.POST_LOGIN,
            bodyParser.json(),
            async function (req, res) {
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
                    return res.status(200).send({token: 'jwt goes here'})
                } catch(error) {
                    logger.error(error)
                    return res.status(400).send({error})
                }
            }
        )

        return router
    }
})()
