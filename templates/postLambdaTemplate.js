'use strict';
const AWS = require('aws-sdk');
const { promisify } = require('util');

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://172.31.24.138:27017';
let cachedDb = null;


async function connectToDatabase(uri) {
  console.log('=> connect to database');
  //  if (cachedDb && cachedDb.serverConfig.isConnected()) {
  //    console.log('=> using cached database instance');
  //    return Promise.resolve(cachedDb);
  //  }

  const mongoClientConnect = promisify(MongoClient.connect.bind());
  cachedDb = await mongoClientConnect(uri);

  return cachedDb;
}

async function queryDatabase (client, event) {
  console.log('=> query database');

  const dbName = 'test';
  const database = client.db(dbName);

  try {
    await database.collection('namiCollection').insertOne({
      event: { nami: 'surfing nami!' },
    });
    return { statusCode: 200, body: 'success' };
  } catch(err) {
    console.log('=> an error occurred: ', err);
    return { statusCode: 500, body: 'error' };
  } finally {
    client.close();
  }
}


exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('event: ', event);

  try {
    const client = await connectToDatabase(uri);
    console.log("connected to mongo");
    const result = await queryDatabase(client, event);
    console.log('=> returning result: ', result);
  } catch(err) {
    console.log('=> an error occurred: ', err);
  }
};
