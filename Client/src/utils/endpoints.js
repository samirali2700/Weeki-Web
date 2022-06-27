export const GET_COMPANY = (companyId) => 'auth/companies/' + companyId;
export const GET_EMPLOYEES = () => 'auth/employees/';
export const GET_EMPLOYEE = (employeeId) => 'auth/employees/' + employeeId;

export const GET_INVITATION_STATUS = () =>
	'invitations/registrationToken/status';
export const GET_INVITATION_VALIDATION = (token) =>
	'invitations/registrationToken/validation/' + token;
export const GET_INVITATION_TOKEN = (email) =>
	'auth/invitations/registrationToken/' + email;

export const POST_INVITATION_VALIDATION = (type) =>
	'invitations/registrationToken/validation?type=' + type;
export const POST_INVITATION_TOKEN = (email) =>
	'auth/invitations/registrationToken/' + email;

export const POST_COMPANY = (creatorId) => 'companies/' + creatorId;
export const POST_EMPLOYEE = (companyId) => 'employees/' + companyId;

export const DELETE_COMPANY = () => 'auth/companies/';
export const DELETE_EMPLOYEE = (employeeId) => 'auth/employees/' + employeeId;

export const GET_USER_PROFILE = (userId) => 'auth/users/profile/' + userId;
export const GET_USERS_PROFILES = (companyId) => 'auth/users/' + companyId;

const userEndpoint = '/users/';

export const POST_USER = ({ companyId, userId }) =>
	userEndpoint + companyId + '/' + userId;
export const PATCH_USER = () => 'auth' + userEndpoint;
export const DELETE_USER = (userId) => 'auth' + userEndpoint + userId;

export const GET_LOGIN = () => 'auth/users/profile/login';
export const SIGNIN = () => 'signin';
export const SIGNUP = () => 'signup';
