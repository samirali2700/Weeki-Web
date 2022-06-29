import {
	ADD_POST,
	FETCH_COMPANY,
	FETCH_COMPANY_NAME,
	FETCH_POSTS,
	REMOVE_POST,
} from '../DB/queries/companyQueries.js';
import {
	OK_CODE,
	CREATED_CODE,
	NOT_FOUND_CODE,
	BAD_REQ_CODE,
} from '../utils/errors/statusCodes.js';
import { ID } from '../DB/mongoDBconnect.js';
import { POSTS_NOT_FOUND, UNKNOWN } from '../utils/errors/errors.js';
import { newId } from '../DB/mongoDBconnect.js';
export const CREATE_POST = ({ companyId, createdBy, name, post }) => {
	return new Promise(async (resolve, reject) => {
		try {
			post.createdBy = createdBy;
			post._id = newId();
			post.name = name;
			post.createdAt = new Date().getTime();
			const result = await ADD_POST(companyId, post);
			resolve({ code: CREATED_CODE, payload: result });
		} catch (e) {
			reject();
		}
	});
};
export const GET_POSTS = ({ companyId }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { posts } = await FETCH_POSTS(companyId);
			if (posts.length > 0) {
				resolve({ code: OK_CODE, payload: { posts: posts } });
			}
			reject({ code: NOT_FOUND_CODE, error: { message: POSTS_NOT_FOUND } });
		} catch (e) {
			reject({ code: BAD_REQ_CODE, error: { message: UNKNOWN } });
		}
	});
};
export const DELETE_POST = ({ companyId, postId }) => {
	return new Promise(async (resolve, reject) => {
		const result = await REMOVE_POST(companyId, postId);

		if (result.matchedCount !== 0) {
			if (result.modifiedCount !== 0) {
				resolve({ code: OK_CODE, payload: { message: 'Sletning fuldført 👍' } });
			}
		}
		reject({ code: NOT_FOUND_CODE, error: { message: POSTS_NOT_FOUND } });
	});
};
