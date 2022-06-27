import { db } from './sqliteConnect.js';

export async function insertToken(id, token) {
	db.run(
		`INSERT INTO refreshTokens(id, token) values
    (? , ?)`,
		[id, token]
	);
}
export async function getToken(id) {
	return db.get('SELECT * FROM refreshTokens WHERE id = ?', id);
}
export async function getTokens() {
	return db.all('SELECT * FROM refreshTokens');
}
export async function matchToken(token) {
	return db.get('SELECT * FORM refreshTokens WHERE token = ?', token);
}
export async function deleteToken(id) {
	db.exec('DELETE FROM refreshTokens WHERE id = ?', id);
}
