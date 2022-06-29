import { Router } from 'express';
import { SIGNIN, SIGNUP } from '../service/authenticate.service.js';
const authRouter = Router();

import { authorize } from '../utils/authorization.js';

authRouter
	.get('/auth', authorize, (req, res) => {
		res.status(req.code).send({ payload: { user: req.user } });
	})
	.post('/auth/signin', async (req, res) => {
		try {
			const { code, payload, accessToken, refreshToken } = await SIGNIN({
				email: req.body.email,
				password: req.body.password,
			});
			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 5,
			});
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60,
			});
			res.status(code).send({ payload: payload });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.post('/auth/signup', async (req, res) => {
		try {
			const { code, payload } = await SIGNUP({
				email: req.body.email,
				password: req.body.password,
			});
			res.status(code).send({ payload: payload });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.delete('/auth/signout', async (req, res) => {
		res.clearCookie('refreshToken');
		res.clearCookie('accessToken');
		res.status(201).send({ success: 'Signed out successfully' });
	});

export default authRouter;
