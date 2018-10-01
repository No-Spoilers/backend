import request from 'supertest'
import mongoose from 'mongoose'
import { Mockgoose } from 'mockgoose'
import { User } from '../models/user';

import app from '../lib/app'
import endpoints from '../config/routes';
import { doesNotThrow } from 'assert';

describe('User route |', () => {

    beforeAll(() => {
        var mockgoose = new Mockgoose(mongoose)
        return mockgoose.prepareStorage()
            .then(() => {
                return mongoose.connect('mongodb://localhost:27017/no-spoilers')
            })
    })

    it('GET /users | returns a list of endpoints', async () => {
        const fixtureUser = {
            user_name: 'Bob',
            password: 'MyPaSsWoRd',
            email: 'test@test.mail'
        }
        
        const testUser = new User(fixtureUser)
    
        await testUser.save()

        const result = await request(app).get(endpoints.GET_USER_LIST)
        
        expect(result.status).toEqual(200)
        
        expect(result.body[0].user_name).toEqual(fixtureUser.user_name)
        expect(result.body[0].password).not.toEqual(fixtureUser.password)
        expect(result.body[0].email).toEqual(fixtureUser.email)
    })
})
