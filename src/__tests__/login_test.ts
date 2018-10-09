import request from 'supertest'

import { connectMongoose, disconnectMongoose, clearDatabase } from './utils';
import app from '../lib/app'
import endpoints from '../config/routes'
import { User as UserModel } from '../models/user'

describe('Login route |', () => {
    beforeAll(connectMongoose);
    beforeEach(clearDatabase);
    afterAll(disconnectMongoose);
    
    it('POST /login | returns a token when successful', async () => {
        const fixtureUser = {
            userName: 'Bob',
            password: 'MyPaSsWoRd',
            email: 'test@test.mail'
        }
        
        const testUser = new UserModel(fixtureUser)
        await testUser.save()
        
        const res = await request(app).post(endpoints.POST_LOGIN)
            .send({ userName: fixtureUser.userName, password: fixtureUser.password})
        
        expect(res.status).toEqual(200)
        expect(res.body).toEqual({
            "token": "jwt goes here"
        })
    })
})
