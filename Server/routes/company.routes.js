import { Router } from 'express';
import {
	GET_COMPANY,
	GET_EMPLOYEE,
	GET_EMPLOYEES,
	CREATE_COMPANY,
	CREATE_EMPLOYEE,
	GENERATE_REGISTRATION_TOKEN,
	VALIDATE_REGISTRATION_TOKEN,
	SEND_INVITATION,
	DELETE_EMPLOYEE,
	DELETE_COMPANY,
} from '../service/company.service.js';

import { checkParams } from '../utils/validation.js';
const companyRouter = Router();

import {
	insertInvitation,
	getInvitation,
	deleteInvitation,
	getAll,
} from '../DB/invite/inviteQueries.js';

companyRouter
	.get(
		'/auth/companies/:companyId/',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await GET_COMPANY({
					companyId: params.companyId,
				});
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)
	.get('/auth/employees/', async (req, res) => {
		try {
			const { code, payload } = await GET_EMPLOYEES({
				companyId: req.user.companyId,
			});
			res.status(code).send({ payload: payload });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.get(
		'/auth/employees/:employeeId',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await GET_EMPLOYEE({
					companyId: req.user.companyId,
					employeeId: params.employeeId,
				});
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)
	.get('/invitations/registrationToken/validation/:token', async (req, res) => {
		const result = await getInvitation(req.ip);
		if (!result) {
			await insertInvitation(req.ip, req.params.token);
		}
		res.redirect('/');
	})
	.get('/auth/invitations/registrationToken/:email', async (req, res) => {
		try {
			const { payload } = await GENERATE_REGISTRATION_TOKEN({
				companyId: req.user.companyId,
				email: req.params.email,
			});
			res.status(201).send({ payload: payload });
		} catch (e) {
			console.log(e);
			res.status(e.code).send({ error: e.error });
		}
	})
	.post('/invitations/registrationToken/validation', async (req, res) => {
		let invitation;
		let token = false;
		const type = req.query.type;
		let redirect = false;
		if (type === 'status') {
			invitation = await getInvitation(req.ip);

			if (invitation) {
				token = invitation.token;
				await deleteInvitation(req.ip);
			}
		} else {
			token = req.body.token;
		}

		try {
			if (token) {
				const { code, payload } = await VALIDATE_REGISTRATION_TOKEN({
					registrationToken: token,
				});
				if (invitation) deleteInvitation(req.ip);
				if (type === 'status') {
					redirect = true;
				}

				res.status(code).send({ payload: { info: payload, redirect: redirect } });
			} else res.status(404).send({ error: { message: 'Not invited' } });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.post('/auth/invitations/registrationToken/:email', async (req, res) => {
		try {
			const { payload } = await SEND_INVITATION({
				companyId: req.user.companyId,
				email: req.params.email,
			});
			res.status(201).send({ payload: payload });
		} catch (e) {
			res.status(e.code).send({ error: e.error });
		}
	})
	.post(
		'/companies/:creatorId',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await CREATE_COMPANY({
					id: params.creatorId,
					company: req.body,
				});
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)
	.post(
		'/employees/:companyId',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await CREATE_EMPLOYEE({
					companyId: params.companyId,
					id: req.body.id,
					position: 'Medarbejder',
				});
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	)
	.delete('/auth/companies/', async (req, res) => {
		try {
			const { code, payload } = await DELETE_COMPANY({
				companyId: req.user.companyId,
				id: req.user._id,
			});
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			res.status(code).send({ payload: payload });
		} catch (e) {
			console.log('error log inside /auth/companies DELETE', e);
			res.status(e.code).send({ error: e.error });
		}
	})

	.delete(
		'/auth/employees/:employeeId',
		checkParams(async function (req, res, params) {
			try {
				const { code, payload } = await DELETE_EMPLOYEE({
					companyId: req.user.companyId,
					employeeId: params.employeeId,
				});
				console.log(payload);
				res.status(code).send({ payload: payload });
			} catch (e) {
				res.status(e.code).send({ error: e.error });
			}
		})
	);

export default companyRouter;
