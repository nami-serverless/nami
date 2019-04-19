const MongoClient = require('mongodb').MongoClient;
const { promisify } = require('util');

// Please do not modify the below line.
const uri = 'mongodb://privateIp:27017';
let cachedDb;

async function connectToDatabase() {
  const dbName = 'nami';
  console.log('=> connect to database');

  if (cachedDb && cachedDb.isConnected(dbName)) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb.db(dbName));
  }

  const mongoClientConnect = promisify(MongoClient.connect.bind(MongoClient));
  cachedDb = await mongoClientConnect(uri);

  return cachedDb.db(dbName);
}

async function queryDatabase(database, event) {
  console.log('=> query database');
  event.Records.forEach((payload) => {
    database.collection('namiCollection').insertOne({
      event: payload,
    });
  });
}

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('event records: ', event.Records);

  // Insert custom code here.
  // event.Records[i].body represents the webhook payload.
  // This Lambda function is set for 5 concurrent executions to throttle
  // connections to the database.
  // Feel free to process your webhook payload in any way you see fit.

  try {
    const database = await connectToDatabase();
    console.log('connected to mongo');
    const result = await queryDatabase(database, event);
    callback(null, result);
  } catch (err) {
    console.log('Error => ', err.message);
    callback(err);
  }
};
