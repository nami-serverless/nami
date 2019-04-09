const MongoClient = require('mongodb').MongoClient;
const { promisify } = require('util');
const uri = 'mongodb://privateIp:27017';
let cachedDb = null;

async function connectToDatabase(uri) {
  console.log('=> connect to database');
  //  if (cachedDb && cachedDb.serverConfig.isConnected()) {
  //    console.log('=> using cached database instance');
  //    return Promise.resolve(cachedDb);
  //  }

  const mongoClientConnect = promisify(MongoClient.connect.bind(MongoClient));
  cachedDb = await mongoClientConnect(uri);

  return cachedDb;
}

async function queryDatabase(client, event) {
  console.log('=> query database');

  const dbName = 'nami';
  const database = client.db(dbName);

  try {
    event.Records.forEach((payload) => {
      database.collection('namiCollection').insertOne({
        event: payload.body,
      });
    });

    return { statusCode: 200, body: 'success' };
  } catch(err) {
    console.log('Query Database Error => ', err.message);
    return { statusCode: 500, body: 'error' };
  } finally {
    client.close();
  }
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('event: ', event.Records[0].body);

  // Insert custom code here.
  // event.Records[0].body is the webhook payload.
  // This Lambda function is set for 5 concurrent executions.
  // Feel free to process your webhook payload in any way you see fit.

  try {
    const client = await connectToDatabase(uri);
    console.log('connected to mongo');
    const result = await queryDatabase(client, event);
    return result;
  } catch (err) {
    console.log('Query Database Error => ', err.message);
  }
};
