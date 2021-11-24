import moment from './moment';

const formatNumber = (n) => {
	n = n.toString();
	return n[1] ? n : `0${n}`;
};

const formatTime = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const getMsgShowTime = (date) => {
	const diffDays = moment(new Date()).diff(moment(date), 'days');
	if (diffDays < 3) return moment(date).calendar();
	if (diffDays < 30) return moment(date).format('MM-DD HH:mm');
	return moment(date).format('YYYY-MM-DD HH:mm');
};

const getDiffTime = (d1, d2) => {
	const diffDays = moment(d1).diff(moment(d2), 'minutes');
	return diffDays;
};

const reloadHomePage = () => {
	const pages = getCurrentPages();
	const prePages = pages[pages.length - 2];
	prePages.onReloadData();
};

module.exports = {
	formatTime,
	getMsgShowTime,
	getDiffTime,
	reloadHomePage,
};
