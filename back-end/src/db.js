import { MongoClient } from 'mongodb';

let client;

export const initializeDbConnection = async () => {
    client = await MongoClient.connect('mongodb://mongo:mongo@localhost:27017/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export const getDbConnection = dbName => {
    const db = client.db(dbName);
    return db;
}