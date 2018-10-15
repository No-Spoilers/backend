import Express from 'express'
import jwt from 'jsonwebtoken';
import logger from './logger';

declare global {
    namespace Express {
        interface Request {
            token: {
                userId?: string | object
                verified?: boolean
            }
        }
    }
}

function getTokenSecret () {
    if (process.env.NODE_ENV === 'test') return 'test-secret'
    if (process.env.TOKEN_SECRET) return process.env.TOKEN_SECRET
    throw new Error('Token Secret missing!')
}

function tokenCheck (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    if (req.headers.authorization) {
        const [bearer, token] = req.headers.authorization.split(' ')
        if (bearer === 'Bearer') {
            try {
                const verifiedData = jwt.verify(token, getTokenSecret())
                req.token = {
                    verified: true,
                    userId: verifiedData
                }
            }
            catch (error) {
                logger.info(`Token check failed: ${error}`)
                req.token = {
                    verified: false
                }
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
