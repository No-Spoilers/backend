import Express from 'express'
import jwt from 'jsonwebtoken';
import logger from './logger';

function getTokenSecret () {
    if (process.env.NODE_ENV === 'test') return 'test-secret'
    if (process.env.TOKEN_SECRET) return process.env.TOKEN_SECRET
    throw new Error('process.env.TOKEN_SECRET missing!')
}

function tokenCheck (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    req.token = {
        verified: false
    }
    if (req.headers.authorization) {
        const [bearer, token] = req.headers.authorization.split(' ')
        if (bearer === 'Bearer') {
            try {
                const verifiedData = jwt.verify(token, getTokenSecret())
                logger.info(`Token verified for userId: ${verifiedData}`)
                req.token = {
                    verified: true,
                    userId: verifiedData
                }
            }
            catch (error) {
                logger.info(`Token check failed: ${error}`, req)
            } 
        }
    }
    next();
}

function createToken (userId: string) {
    const token = jwt.sign(userId, getTokenSecret());
    return token
}

export default {
    tokenCheck,
    createToken
}
