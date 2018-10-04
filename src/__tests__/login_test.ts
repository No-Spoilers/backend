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

    afterAll(() => {
        return mongoose.disconnect()
    })

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
        console.log('--> res.body :', JSON.stringify(res.body, null, 4));
        expect(res.status).toEqual(200)
        return
    })
})
