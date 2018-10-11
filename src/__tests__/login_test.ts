import request from 'supertest'
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4'

import { connectMongoose, disconnectMongoose, clearDatabase } from './utils';
import app from '../lib/app'
import endpoints from '../config/routes'
import { User as UserModel } from '../models/user'

describe('Login route |', () => {
    beforeAll(connectMongoose);
    beforeEach(clearDatabase);
    afterAll(disconnectMongoose);
    
    it('POST /login | returns a token when successful', async () => {
        const userId = uuidv4()

        const fixtureUser = {
            userId,
            userName: 'Bob',
            password: 'MyPaSsWoRd',
            email: 'test@test.mail'
        }
        
        const testUser = new UserModel(fixtureUser)
        await testUser.save()
        
        const res = await request(app).post(endpoints.POST_LOGIN)
            .send({ userName: fixtureUser.userName, password: fixtureUser.password})
        
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
