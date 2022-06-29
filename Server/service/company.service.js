import {
	FETCH_COMPANY,
	ADD_COMPANY,
	ADD_EMPLOYEE,
	REMOVE_EMPLOYEE,
	FETCH_EMPLOYEE,
	FETCH_EMPLOYEES,
	FETCH_COMPANY_NAME,
	REMOVE_COMPANY,
	FETCH_EMPLOYEES_ID,
} from '../DB/queries/companyQueries.js';
import {
	COMPANY_EXISTS,
	UNKNOWN,
	COMPANY_NOT_FOUND,
	EMPLOYEE_EXISTS,
	EMPLOYEE_NOT_FOUND,
	USER_EXISTS,
	BAD_TOKEN,
} from '../utils/errors/errors.js';
import {
	MONGO_DB_DUPLICATE_CODE,
	BAD_REQ_CODE,
	CREATED_CODE,
	OK_CODE,
	NOT_FOUND_CODE,
	DUPLICATE_RECORD,
} from '../utils/errors/statusCodes.js';
import { FETCH_USERS } from '../DB/queries/userQueries.js';

import { ID } from '../DB/mongoDBconnect.js';
import { generateRegisterToken, verifyToken } from '../utils/tokens.js';

import {
	DELETE_AUTHENTICATION,
	CHECK_AUTHENTICATION_EXISTS,
	DELETE_AUTHENTICATIONS,
} from './authenticate.service.js';

import mailService from '../mail/mailService.js';

export const CREATE_COMPANY = async ({ id, company }) => {
	return new Promise(async (resolve, reject) => {
		company.createdBy = ID(id);
		company.createdAt = new Date().getTime();
		company.employees = [];
		try {
			const result = await ADD_COMPANY(company);
			resolve({ code: CREATED_CODE, payload: { companyId: result.insertedId } });
		} catch (e) {
			reject({
				code: BAD_REQ_CODE,
				error: {
					message: e.code === MONGO_DB_DUPLICATE_CODE ? COMPANY_EXISTS : UNKNOWN,
				},
			});
		}
	});
};
export const CREATE_EMPLOYEE = async ({ companyId, id, position }) => {
	return new Promise(async (resolve, reject) => {
		const result = await ADD_EMPLOYEE(companyId, ID(id), position);
		if (result.matchedCount !== 0) {
			if (result.modifiedCount !== 0) {
				resolve({
					code: CREATED_CODE,
					payload: {
						message: 'Medarbejder tilføjet',
						modifiedCount: result.modifiedCount,
					},
				});
			}
			reject({ code: DUPLICATE_RECORD, error: { message: EMPLOYEE_EXISTS } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: COMPANY_NOT_FOUND } });
	});
};

export const GET_COMPANY = async ({ companyId }) => {
	return new Promise(async (resolve, reject) => {
		const company = await FETCH_COMPANY(companyId);
		if (company) {
			resolve({ code: OK_CODE, payload: { company: company } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: COMPANY_NOT_FOUND } });
	});
};
export const GET_EMPLOYEE = async ({ companyId, employeeId }) => {
	return new Promise(async (resolve, reject) => {
		const { employees } = await FETCH_EMPLOYEE(companyId, employeeId);
		if (employees) {
			resolve({ code: OK_CODE, payload: { employee: employees[0] } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: EMPLOYEE_NOT_FOUND } });
	});
};
export const GET_EMPLOYEES = async ({ companyId }) => {
	return new Promise(async (resolve, reject) => {
		const { employees } = await FETCH_EMPLOYEES(companyId);
		if (employees.length > 0) {
			const users = await (await FETCH_USERS(companyId)).toArray();

			resolve({
				code: OK_CODE,
				payload: { employees: employees, userInfo: users },
			});
		}
		reject({ code: NOT_FOUND_CODE, error: { message: EMPLOYEE_NOT_FOUND } });
	});
};

export const DELETE_COMPANY = ({ companyId, id }) => {
	return new Promise(async (resolve, reject) => {
		const { employees } = await FETCH_EMPLOYEES_ID(companyId);
		const employeesId = employees.map((e) => e._id);

		employeesId.push(id);

		resolve({ code: 201, payload: { message: 'good' } });
		const result = await REMOVE_COMPANY(companyId);
		if (result.deletedCount !== 0) {
			try {
				const { code, payload } = await DELETE_AUTHENTICATIONS({
					ids: employeesId,
				});
				resolve({ code: code, payload: payload });
			} catch (e) {
				reject({ code: e.code, error: e.error });
			}
		}
		reject({ code: NOT_FOUND_CODE, error: { message: COMPANY_NOT_FOUND } });
	});
};
export const DELETE_EMPLOYEE = async ({ companyId, employeeId }) => {
	return new Promise(async (resolve, reject) => {
		const result = await REMOVE_EMPLOYEE(companyId, employeeId);

		if (result.matchedCount !== 0) {
			if (result.modifiedCount !== 0) {
				try {
					const { code, payload } = await DELETE_AUTHENTICATION({ id: employeeId });
					resolve({ code, payload: { message: 'Sletning fuldført 👍' } });
				} catch (e) {
					reject({ code: e.code, error: e.error });
				}
			}
			reject({ code: NOT_FOUND_CODE, error: { message: EMPLOYEE_NOT_FOUND } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: COMPANY_NOT_FOUND } });
	});
};

export const GENERATE_REGISTRATION_TOKEN = ({ companyId, email }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { code } = await CHECK_AUTHENTICATION_EXISTS({ email });
			const { name } = await FETCH_COMPANY_NAME(companyId);
			const registrationToken = await generateRegisterToken({
				companyId,
				email,
				name,
			});
			resolve({ code: code, payload: { token: registrationToken } });
		} catch (e) {
			reject({ code: e.code, error: { message: USER_EXISTS } });
		}
	});
};
export const SEND_INVITATION = ({ companyId, email }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { payload } = await GENERATE_REGISTRATION_TOKEN({ companyId, email });

			await mailService({
				to: email,
				type: 'invite_employee',
				linkTo: `api/invitations/registrationToken/validation/${payload.token}`,
				name: '',
			});

			resolve({
				code: OK_CODE,
				payload: { message: `${email} er blevet inviteret til Weeki` },
			});
		} catch (e) {
			reject(e);
		}
	});
};
export const VALIDATE_REGISTRATION_TOKEN = ({ registrationToken }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { payload } = await verifyToken(registrationToken, 'registration');
			resolve({ code: OK_CODE, payload: payload.data });
		} catch (e) {
			reject({ code: NOT_FOUND_CODE, error: { message: BAD_TOKEN } });
		}
	});
};
