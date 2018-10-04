import request from 'supertest'
import mongoose from 'mongoose'
import { Mockgoose } from 'mockgoose'
import { User as UserModel } from '../models/user';

import app from '../lib/app'
import endpoints from '../config/routes';
import { doesNotThrow } from 'assert';

describe('User route |', () => {
    let mockgoose: any;

    beforeAll(async () => {
        // fix parallel tests
        Mockgoose.prototype.prepareStorage = function() {
            const _this = this;
            return new Promise(function(resolve, reject) {
            Promise.all([_this.getTempDBPath(), _this.getOpenPort()])
            .then(([dbPath, _openPort]) => {
                const openPort = _openPort.toString()
                const storageEngine = _this.getMemoryStorageName()
                const mongodArgs = ['--port', openPort, '--storageEngine', storageEngine, '--dbpath', dbPath]
                _this.mongodHelper.mongoBin.commandArguments = mongodArgs
                const mockConnection = () => {
                    _this.mockConnectCalls(_this.getMockConnectionString(openPort))
                    resolve();
                }
                _this.mongodHelper.run().then(mockConnection).catch(mockConnection)
            });
            });
        };
        
        mockgoose = new Mockgoose(mongoose);
        await mockgoose.prepareStorage()
        return mongoose.connect('mongodb://localhost:27017/no-spoilers')
    })

    afterAll(async () => {
        await mockgoose.helper.reset();
        return mongoose.disconnect();
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
        return
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
        return
    })
})
