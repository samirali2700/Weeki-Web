import { Router } from 'express';
const postRouter = Router();

import { checkParams } from '../utils/validation.js';

import {
	CREATE_POST,
	GET_POSTS,
	DELETE_POST,
} from '../service/post.service.js';

postRouter
	.get('/auth/posts/', async (req, res) => {
		try {
			const { code, payload } = await GET_POSTS({
				companyId: req.user.companyId,
			});

			res.status(code).send({ payload: payload });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.post('/auth/posts/', async (req, res) => {
		try {
			const { code, payload } = await CREATE_POST({
				companyId: req.user.companyId,
				createdBy: req.user._id,
				name: req.user.firstname + ' ' + req.user.lastname,
				post: req.body,
			});
			res.status(code).send({ payload: payload });
		} catch (e) {
			res.status(401).send({ error: e.error });
		}
	})
	.delete(
		'/auth/posts/:postId',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await DELETE_POST({
					companyId: req.user.companyId,
					postId: params.postId,
				});
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	);

export default postRouter;
