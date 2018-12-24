import request from 'supertest'
import app from '../lib/app'
import endpoints from '../config/routes'
import { connectMongoose, disconnectMongoose, clearDatabase } from './utils'
import UserModel from '../models/user'
import jwt from 'jsonwebtoken';

describe('Signup route |', () => {
    beforeAll(connectMongoose)
    beforeEach(clearDatabase)
    afterAll(disconnectMongoose)

    it('POST /signup | returns 201 when successful', async () => {
        const newUser = {
            email: 'new@email.com',
            userName: 'New User',
            password: 'new user password'
        }

        const res = await request(app).post(endpoints.POST_SIGNUP).send(newUser)
    
        expect(res.status).toEqual(201)
        expect(res.body.success).toEqual(true)

        const foundUser = await UserModel.find({"email": "new@email.com"})

        expect(foundUser.length).toEqual(1);

        expect(foundUser[0]).toHaveProperty('email', newUser.email);
        expect(foundUser[0]).toHaveProperty('userName', newUser.userName);

        const newUserId = foundUser[0].userId;

        const res2 = await request(app).post(endpoints.POST_LOGIN)
            .send({ userName: 'New User', password: 'new user password'})
    
        expect(res2.status).toEqual(200)
        expect(res2.body).toHaveProperty('token')

        const verified = jwt.verify(res2.body.token, 'test-secret')
        expect(verified).toEqual(newUserId)
    })

    it('POST /signup | returns 200 when user already exists', async () => {
        const newUser = {
            email: 'standard@user.mail',
            userName: 'Standard User',
            password: 'new user password'
        }

        const res = await request(app).post(endpoints.POST_SIGNUP).send(newUser)
    
        expect(res.status).toEqual(200)
        expect(res.body.msg).toEqual("User name or email address already taken")
        expect(res.body.success).toEqual(false)
    })
})
