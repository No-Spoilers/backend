import request from 'supertest'
import jwt from 'jsonwebtoken';
import app from '../lib/app'
import endpoints from '../config/routes'
import { connectMongoose, disconnectMongoose, clearDatabase } from './utils';

describe('Login route |', () => {
    beforeAll(connectMongoose);
    beforeEach(clearDatabase);
    afterAll(disconnectMongoose);
    
    it('POST /login | returns a token when successful', async () => {
        const res = await request(app).post(endpoints.POST_LOGIN)
            .send({ userName: 'Standard User', password: 'standard user password'})
        
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('token')
        const verified = jwt.verify(res.body.token, 'test-secret')
        expect(verified).toEqual(expect.stringMatching(/^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i))
        try {
            jwt.verify(res.body.token, 'not-the-secret')
        }
        catch (error) {
            expect(error.toString()).toEqual('JsonWebTokenError: invalid signature')
        }
    })
})
