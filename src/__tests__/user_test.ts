import request from 'supertest'
import utils from './utils';
import app from '../lib/app'
import endpoints from '../config/routes';
import { IUser } from '../interfaces/UserInterface'

describe('User route |', () => {
    beforeAll(utils.connectMongoose);
    beforeEach(utils.clearDatabase);
    afterAll(utils.disconnectMongoose);

    it('GET /users | returns a list of users', async () => {
        const token = utils.getAdminToken()
        const result = await request(app)
            .get(endpoints.GET_USER_LIST)
            .set({authorization: `Bearer ${token}`})
        
        expect(result.status).toEqual(200)

        const adminIndex = result.body.findIndex((item: IUser) => item.userName === 'Admin User')
        expect(result.body[adminIndex].userName).toEqual('Admin User')
        expect(result.body[adminIndex].passwordHash).not.toBeDefined()
        expect(result.body[adminIndex].password).not.toBeDefined()
        expect(result.body[adminIndex].email).toEqual('admin@user.mail')
    })

    it('GET /user/:userId | returns specified user', async () => {
        const userId = utils.getStandardUserId()
        const token = utils.getStandardToken()

        const testRoute = endpoints.GET_USER_BY_ID.replace(':userId', userId)
        const result = await request(app)
            .get(testRoute)
            .set({authorization: `Bearer ${token}`})

        expect(result.status).toEqual(200)

        expect(result.body.userName).toEqual('Standard User')
        expect(result.body.password).not.toBeDefined()
        expect(result.body.email).toEqual('standard@user.mail')
    })

    it('POST /user | creates new user in DB', async () => {
        const fixtureUser = {
            userName: 'New User',
            password: 'MyPaSsWoRd',
            email: 'new_user@test.mail'
        }

        const testRoute = endpoints.POST_USER
        const res = await request(app).post(testRoute).send(fixtureUser)

        expect(res.status).toEqual(201)

        expect(res.body.password).not.toBeDefined()
        expect(res.body.userName).toEqual(fixtureUser.userName)
        expect(res.body.email).toEqual(fixtureUser.email)
        expect(res.body).toHaveProperty('userId')
        expect(res.body).toHaveProperty('createdAt')
    })
})
