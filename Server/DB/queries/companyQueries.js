import { companies } from '../collections.js';

export const FETCH_COMPANY = async (_companyId) => {
	return companies.findOne({ _id: _companyId });
};
export const FETCH_COMPANY_NAME = async (_companyId) => {
	return companies.findOne(
		{ _id: _companyId },
		{ projection: { name: 1, _id: 0 } }
	);
};
export const ADD_COMPANY = async (company) => {
	return companies.insertOne(company);
};
export const REMOVE_COMPANY = async (_companyId) => {
	return companies.deleteOne({ _id: _companyId });
};

export const FETCH_EMPLOYEE = async (_companyId, _employeeId) => {
	return companies.findOne(
		{ _id: _companyId },
		{
			employees: { $elemMatch: { _id: _employeeId } },
			projection: { employees: 1, _id: 0 },
		}
	);
};

export const FETCH_EMPLOYEES_ID = async (_companyId) => {
	return companies.findOne(
		{ _id: _companyId },
		{ projection: { employees: { _id: 1 }, _id: 0 } }
	);
};

export const FETCH_EMPLOYEES = async (_companyId) => {
	return companies.findOne(
		{ _id: _companyId },
		{ projection: { employees: 1 } }
	);
};
export const ADD_EMPLOYEE = async (_companyId, _id, position) => {
	return companies.updateOne(
		{ _id: _companyId },
		{ $addToSet: { employees: { _id: _id, position: position } } }
	);
};
export const REMOVE_EMPLOYEE = async (_companyId, _id) => {
	return companies.updateOne(
		{ _id: _companyId },
		{ $pull: { employees: { _id: _id } } }
	);
};
