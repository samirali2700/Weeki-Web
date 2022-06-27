import { DB } from './mongoDBconnect.js';

export const authentication = DB.collection('Authentication');
authentication.createIndex({ email: 1 }, { unique: true });

export const companies = DB.collection('Companies');
companies.createIndex({ name: 1 }, { unique: true });
companies.createIndex({ cvr: 1 }, { unique: true });

export const users = DB.collection('Users');
