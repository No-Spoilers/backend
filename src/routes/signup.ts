import express from 'express'
import logger from "../lib/logger";
import UserModel from '../models/user';
import bodyParser from 'body-parser'
import endpoints from '../config/routes';
import uuidv4 from 'uuid/v4';

export default function setupRoutes (router: express.Router) {
    router.post(
        endpoints.POST_SIGNUP,
        bodyParser.json(),
        async function postSignupEndpoint (req, res) {
            try {
                logger.info(`POST_SIGNUP Request received`)
                logger.info(`req.body.email:${JSON.stringify(req.body.email)}` +
                `| req.body.userName:${JSON.stringify(req.body.userName)}` +
                `| req.body.password included? ${!!JSON.stringify(req.body.password)}`)

                const newUser = {
                    email: req.body.email,
                    userName: req.body.userName,
                    password: req.body.password,
                    userId: ''
                }

                const userFound = await UserModel.findOne({$or: [{email: newUser.email}, {userName: newUser.userName} ]})
                if (userFound) {
                    return res.status(400).send({error:'User name or email address already taken'});
                }

                newUser.userId = uuidv4();
                await UserModel.create(newUser);
                return res.status(201).send({msg: `User ${newUser.userName} created`})
            } catch (error) {
                const errorId = logger.error(error)
                return res.status(500).send({error: `Unexpected error. Please see log ${errorId}`})
            }
        }
    )

    return router
}
