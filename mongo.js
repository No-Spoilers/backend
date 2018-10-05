const MongodbMemoryServer = require('mongodb-memory-server')
const MongoClient = require('mongodb')

async function setup () {
  let mongoMemoryDB
  let connection
  try {
    mongoMemoryDB = new MongodbMemoryServer.default()

    const uri = await mongoMemoryDB.getConnectionString()
    const port = await mongoMemoryDB.getPort()
    const dbPath = await mongoMemoryDB.getDbPath()
    const dbName = await mongoMemoryDB.getDbName()

    console.table({uri, port, dbPath, dbName})

    connection = await MongoClient.connect(uri, { useNewUrlParser: true })
    const db = await connection.db(dbName)

    const testCollection = db.collection('test')

    const insertResult = await testCollection.insertMany([{ name: 'Steve' }, { pet: 'cat' }])
    console.log(JSON.stringify(insertResult, null, 2))

    const findResult = await testCollection.find().toArray()
    console.log(JSON.stringify(findResult, null, 2))

    connection.close()
    mongoMemoryDB.stop()
  } catch (error) {
    console.log('error:', error)
    if (connection) connection.close()
    mongod.stop()
    process.exit(1)
  }
}

setup()
