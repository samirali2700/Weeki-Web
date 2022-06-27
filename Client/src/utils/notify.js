import { toast } from '@zerodevx/svelte-toast';

export const notifyError = message => {
	toastr.error(message, 'Fejl');
};

export const notifySuccess = message => {
	toastr.success(message);
};

export const notifyInfo = message => {
	toastr.info(message);
};
toastr.options = {
	closeButton: false,
	debug: false,
	newestOnTop: true,
	progressBar: true,
	positionClass: 'toast-top-left',
	preventDuplicates: true,
	onclick: null,
	showDuration: '300',
	hideDuration: '1000',
	timeOut: '5000',
	extendedTimeOut: '1000',
	showEasing: 'swing',
	hideEasing: 'linear',
	showMethod: 'fadeIn',
	hideMethod: 'fadeOut',
};
