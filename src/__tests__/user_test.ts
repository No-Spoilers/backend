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

    it('GET /users | returns a list of users', async () => {
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
        expect(result.body[0].password).not.toBeDefined()
        expect(result.body[0].email).toEqual(fixtureUser.email)
    })

    it('GET /user/:userId | returns specified user', async () => {
        const fixtureUser = {
            user_name: 'Doug',
            password: 'MyPaSsWoRd2',
            email: 'test2@test.mail'
        }
        
        const testUser = new User(fixtureUser)
        const savedFixture = await testUser.save()

        const testRoute = endpoints.GET_USER_BY_ID.replace(':userId', savedFixture._id)
        const result = await request(app).get(testRoute)
        
        expect(result.status).toEqual(200)
        
        expect(result.body.user_name).toEqual(fixtureUser.user_name)
        expect(result.body.password).not.toBeDefined()
        expect(result.body.email).toEqual(fixtureUser.email)
    })
})
