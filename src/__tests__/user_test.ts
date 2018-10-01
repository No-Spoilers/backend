import request from 'supertest'
import mongoose from 'mongoose'
import { Mockgoose } from 'mockgoose'
import { User as UserModel } from '../models/user';

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
            userName: 'Bob',
            password: 'MyPaSsWoRd',
            email: 'test@test.mail'
        }
        
        const testUser = new UserModel(fixtureUser)
    
        await testUser.save()

        const result = await request(app).get(endpoints.GET_USER_LIST)
        
        expect(result.status).toEqual(200)

        expect(result.body[0].userName).toEqual(fixtureUser.userName)
        expect(result.body[0].passwordHash).not.toBeDefined()
        expect(result.body[0].password).not.toBeDefined()
        expect(result.body[0].email).toEqual(fixtureUser.email)
    })

    it('GET /user/:userId | returns specified user', async () => {
        const fixtureUser = {
            userName: 'Doug',
            password: 'MyPaSsWoRd2',
            email: 'test2@test.mail'
        }
        
        const testUser = new UserModel(fixtureUser)
        const savedFixture = await testUser.save()

        const testRoute = endpoints.GET_USER_BY_ID.replace(':userId', savedFixture._id)
        const result = await request(app).get(testRoute)
        
        expect(result.status).toEqual(200)

        expect(result.body.userName).toEqual(fixtureUser.userName)
        expect(result.body.password).not.toBeDefined()
        expect(result.body.email).toEqual(fixtureUser.email)

        // TEMP password testing
        let tryMe = await testUser.validPassword('foo')
        console.log('--> tryMe :', tryMe);
        tryMe = await testUser.validPassword(fixtureUser.password)
        console.log('--> tryMe :', tryMe);
    })
})
