import { db } from './sqliteConnect.js';

export async function insertInvitation(id, token) {
	db.run(
		`INSERT INTO invitations(id, token) values
    (? , ?)`,
		[id, token]
	);
}
export async function getInvitation(id) {
	return db.get('SELECT * FROM invitations WHERE id = ?', id);
}
export async function getAll() {
	return db.get('SELECT * FROM invitations');
}
export async function deleteInvitation(id) {
	db.run('DELETE FROM invitations WHERE id = ?', id);
}
