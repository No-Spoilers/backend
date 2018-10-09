import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

let mongoMemoryDB: MongodbMemoryServer;

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
}

export async function disconnectMongoose() {
    mongoose.disconnect();
    mongoMemoryDB.stop()
}
