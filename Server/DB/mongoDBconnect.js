import { MongoClient, ObjectId } from 'mongodb';

const DB_NAME = 'Weeki';
const DB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_SERVER}/?retryWrites=true&w=majority`;
const CLIENT = new MongoClient(DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export const connect = () => {
	return CLIENT.connect();
};
export const DB = CLIENT.db(DB_NAME);

export const ID = id => ObjectId(id);
export const VALIDATE = id => ObjectId.isValid(id);

import { BAD_REQ_CODE } from '../utils/errors/statusCodes.js';
import { BAD_PARAMS } from '../utils/errors/errors.js';
export const ID_VALIDATED = id => {
	return new Promise(async (resolve, reject) => {
		ObjectId.isValid(id)
			? resolve(ObjectId(id))
			: reject({ code: BAD_REQ_CODE, error: BAD_PARAMS });
	});
};
