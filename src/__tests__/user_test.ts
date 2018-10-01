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
        const testUser = new User({
            user_name: 'Bob',
            encoded_password: 'no password encoding',
            email: 'test@test.mail'
        })
    
        await testUser.save()

        const result = await request(app).get(endpoints.GET_USER_LIST)
        
        expect(result.status).toEqual(200)
        
        expect(result.body[0].user_name).toEqual("Bob")
        expect(result.body[0].encoded_password).toEqual("no password encoding")
        expect(result.body[0].email).toEqual("test@test.mail")
    })
})
