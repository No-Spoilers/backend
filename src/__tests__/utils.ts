import mongoose from 'mongoose'
import MongodbMemoryServer from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'
import uuidv4 from 'uuid/v4'

import { User as UserModel } from '../models/user'
import { Item as ItemModel } from '../models/item'
import * as fixtures from './fixtures'

let mongoMemoryDB: MongodbMemoryServer
let adminUserId: string
let standardUserId: string

export async function connectMongoose() {
    mongoMemoryDB = new MongodbMemoryServer()
    const mongoUri = await mongoMemoryDB.getConnectionString()
    const mongoDbName = await mongoMemoryDB.getDbName()

    mongoose.set('useCreateIndex', true)

    return mongoose.connect(mongoUri, {
        dbName: mongoDbName,
        useNewUrlParser: true
    })
}
    
export async function clearDatabase() {
    await mongoose.connection.db.dropDatabase()

    await Promise.all([
        UserModel.create(fixtures.users),
        ItemModel.create(fixtures.items)
    ])

    adminUserId = fixtures.users[0].userId
    standardUserId = fixtures.users[1].userId
}

export async function disconnectMongoose() {
    mongoose.disconnect()
    mongoMemoryDB.stop()
}

export function createValidToken (userId: string) {
    userId = userId? userId : uuidv4()
    return jwt.sign(userId, 'test-secret')
}

export function getAdminToken() {
    return createValidToken(adminUserId)
}

export function getStandardToken() {
    return createValidToken(standardUserId)
}

export function getStandardUserId() {
    return standardUserId
}

export default {
    connectMongoose,
    clearDatabase,
    disconnectMongoose,
    createValidToken,
    getAdminToken,
    getStandardToken,
    getStandardUserId
}