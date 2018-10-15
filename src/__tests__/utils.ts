import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4'

import { User as UserModel } from '../models/user';

let mongoMemoryDB: MongodbMemoryServer;
let adminUserId: string;
let standardUserId: string;

export async function connectMongoose() {
    mongoMemoryDB = new MongodbMemoryServer()
    const mongoUri = await mongoMemoryDB.getConnectionString()
    const mongoDbName = await mongoMemoryDB.getDbName()

    mongoose.set('useCreateIndex', true)

    return mongoose.connect(mongoUri, {
        dbName: mongoDbName,
        useNewUrlParser: true
    });
}
    
export async function clearDatabase() {
    await mongoose.connection.db.dropDatabase();

    adminUserId = uuidv4()

    const adminUserProperties = {
        userId: adminUserId,
        userName: 'Admin User',
        password: 'admin user password',
        email: 'admin@user.mail',
        role: 'admin'
    }
    
    const adminUser = new UserModel(adminUserProperties)
    await adminUser.save()

    standardUserId = uuidv4()

    const standardUserProperties = {
        userId: standardUserId,
        userName: 'Standard User',
        password: 'standard user password',
        email: 'standard@user.mail',
        role: 'standard'
    }
    
    const standardUser = new UserModel(standardUserProperties)
    await standardUser.save()
}

export async function disconnectMongoose() {
    mongoose.disconnect();
    mongoMemoryDB.stop()
}

export function createValidToken (userId: string) {
    userId = userId? userId : uuidv4()
    return jwt.sign(userId, 'test-secret');
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