const authEndpoint = 'auth/';

export const GET_COMPANY = (companyId) =>
	authEndpoint + 'companies/' + companyId;
export const GET_EMPLOYEES = () => authEndpoint + 'employees/';
export const GET_EMPLOYEE = (employeeId) =>
	authEndpoint + 'employees/' + employeeId;

const invitationEndpoint = 'invitations/registrationToken/';
export const GET_INVITATION_STATUS = () => invitationEndpoint + 'status';
export const GET_INVITATION_VALIDATION = (token) =>
	invitationEndpoint + 'validation/' + token;
export const GET_INVITATION_TOKEN = (email) =>
	'auth/' + invitationEndpoint + email;

export const POST_INVITATION_VALIDATION = (type) =>
	invitationEndpoint + 'validation?type=' + type;
export const POST_INVITATION_TOKEN = (email) =>
	'auth/' + invitationEndpoint + email;

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

export const GET_LOGIN = () => 'auth' + userEndpoint + 'profile/login';
export const SIGNIN = () => 'signin';
export const SIGNUP = () => 'signup';

const postEndpoint = '/posts/';

export const GET_POSTS = () => 'auth' + postEndpoint;
export const POST_POST = () => 'auth' + postEndpoint;
export const DELETE_POST = (postId) => 'auth' + postEndpoint + postId;
