import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const db = await open({
	filename: path.join(__dirname, 'auth.db'),
	driver: sqlite3.Database,
});

await db.exec('DROP TABLE IF EXISTS invitations');
await db.exec(
	`CREATE TABLE invitations(id VARCHAR(2300) PRIMARY KEY, token VARCHAR(1250) NOT NULL)`
);
