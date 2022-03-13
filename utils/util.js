/* eslint-disable max-len */
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

const getDays = (year, month) => {
	const d = new Date(year, month, 0);
	return d.getDate();
};

const getStoragePublishMsg = (key) => {
	// publish 的数据结构
	// {
	//     发布1
	//     publish1: {title: "", instrumentSelectId: ""}
	// }
	const publish = wx.getStorageSync('publish');
	let temp = {};
	if (publish) {
		temp = JSON.parse(publish)[key];
	}
	return temp;
};

const setStoragePublishMsg = (key, data) => {
	let publish = wx.getStorageSync('publish');
	if (publish) {
		publish = JSON.parse(publish);
		const temp = publish[key] || {};
		publish[key] = { ...temp, ...data };
	} else {
		publish = {};
		publish[key] = data;
	}
	wx.setStorageSync('publish', JSON.stringify(publish));
};

const getRandomStr = () => {
	let str = '';
	// eslint-disable-next-line prettier/prettier
    const arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	for (let i = 1; i <= 16; i++) {
		const random = Math.floor(Math.random() * arr.length);
		str += arr[random];
	}
	return str;
};

module.exports = {
	formatTime,
	getMsgShowTime,
	getDiffTime,
	reloadHomePage,
	getDays,
	getStoragePublishMsg,
	setStoragePublishMsg,
	getRandomStr,
};
