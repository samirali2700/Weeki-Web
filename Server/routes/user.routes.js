import { Router } from 'express';
import {
	DELETE_USER,
	GET_USER,
	GET_USERS,
	UPDATE_USER,
	CREATE_USER,
	VERIFY_ACCOUNT,
	GET_USER_LOGIN,
} from '../service/user.service.js';

import { checkParams } from '../utils/validation.js';

const userRouter = Router();

userRouter
	.get('/auth/users/profile/login', async (req, res) => {
		try {
			const { code, payload } = await GET_USER_LOGIN({ id: req.user._id });
			res.status(code).send({ payload: payload });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.get(
		'/auth/users/profile/:userId',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await GET_USER({ id: params.userId });
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)

	.get(
		'/auth/users/:companyId',

		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await GET_USERS({ id: params.companyId });
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)
	.get(
		'/users/account/validation/:userId',
		checkParams(async function (req, res, params) {
			try {
				const { payload, code } = await VERIFY_ACCOUNT({
					id: params.userId,
				});
				res.status(code).redirect('/');
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)

	.post(
		'/users/:companyId/:userId',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await CREATE_USER({
					companyId: params.companyId,
					userId: params.userId,
					user: req.body.user,
					email: req.body.email,
					verified: false,
				});
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)
	.patch('/auth/users/', async (req, res) => {
		try {
			const { code, payload } = await UPDATE_USER({
				id: req.user._id,
				user: req.body,
			});
			res.status(code).send({ payload: payload });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.delete(
		'/users/:userId',
		checkParams(async function (req, res, params) {
			try {
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	);

export default userRouter;
