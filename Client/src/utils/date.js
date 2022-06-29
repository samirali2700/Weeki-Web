export const getDay = (dayNum) => {
	switch (dayNum) {
		case 0:
			return 'Søndag';
		case 1:
			return 'Mandag';
		case 2:
			return 'Tirsdag';
		case 3:
			return 'Onsdag';
		case 4:
			return 'Torsdag';
		case 5:
			return 'Fredag';
		case 6:
			return 'Lørdag';
		default:
			return 'ukendt';
	}
};
export const getMonth = (monthNum) => {
	switch (monthNum) {
		case 0:
			return 'Januar';
		case 1:
			return 'Februar';
		case 2:
			return 'Marts';
		case 3:
			return 'April';
		case 4:
			return 'Maj';
		case 5:
			return 'Juni';
		case 6:
			return 'Juli';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'Oktober';
		case 10:
			return 'November';
		case 11:
			return 'December';
		default:
			return 'ukendt';
	}
};
