declare namespace Express {
    export interface Request {
        token: {
            userId?: string | object
            verified?: boolean
        }
        params?: any
    }
 }