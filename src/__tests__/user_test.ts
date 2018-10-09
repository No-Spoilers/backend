import request from 'supertest'

import { connectMongoose, disconnectMongoose, clearDatabase } from './utils';
import app from '../lib/app'
import endpoints from '../config/routes';
import { User as UserModel } from '../models/user';

describe('User route |', () => {
    beforeAll(connectMongoose);
    beforeEach(clearDatabase);
    afterAll(disconnectMongoose);

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
        const savedUser = await testUser.save()

        const testRoute = endpoints.GET_USER_BY_ID.replace(':userId', savedUser._id)
        const result = await request(app).get(testRoute)
        
        expect(result.status).toEqual(200)

        expect(result.body.userName).toEqual(fixtureUser.userName)
        expect(result.body.password).not.toBeDefined()
        expect(result.body.email).toEqual(fixtureUser.email)
    })
})
