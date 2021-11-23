import moment from './moment';
import { filterContentTypeByNum } from './filter';

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

// 将内容处理一下（array）
const handleContentList = (res, screenWidth) => {
	if (!Array.isArray(res)) return [];
	res.forEach((item) => {
		item.type = filterContentTypeByNum(item.type);
		if (item.type === 'posts' || item.type === 'blogs' || item.type === 'img') {
			if (item.postsDetail) {
				const { img_urls } = item.postsDetail;
				if (Array.isArray(img_urls) && img_urls.length > 2) {
					const imgList = item.postsDetail.img_urls;
					const len = imgList.length;
					const remain = len % 3;
					let newImgList = imgList;
					if (remain === 1) {
						newImgList = imgList.concat([{ empty: true }, { empty: true }]);
					}
					if (remain === 2) {
						newImgList = imgList.concat([{ empty: true }]);
					}
					item.postsDetail.img_urls = newImgList;
				}
			}
		}
		if (item.type === 'video') {
			const { height, width } = item.videoDetail;
			if (Number(height) > Number(width)) {
				let newWidth = screenWidth;
				newWidth = Number((screenWidth * 2) / 3).toFixed(0);
				item.videoDetail.videoWidth = newWidth;
				item.videoDetail.videoHeight = newWidth * 1.3 < height ? newWidth * 1.3 : height;
			}
		}
	});
};

// 将内容处理一下（obj）
const handleContentObj = (item, screenWidth) => {
	item.type = filterContentTypeByNum(item.type);
	if (item.type === 'posts' || item.type === 'blogs' || item.type === 'img') {
		if (item.postsDetail) {
			const { img_urls } = item.postsDetail;
			if (Array.isArray(img_urls) && img_urls.length > 2) {
				const imgList = item.postsDetail.img_urls;
				const len = imgList.length;
				const remain = len % 3;
				let newImgList = imgList;
				if (remain === 1) {
					newImgList = imgList.concat([{ empty: true }, { empty: true }]);
				}
				if (remain === 2) {
					newImgList = imgList.concat([{ empty: true }]);
				}
				item.postsDetail.img_urls = newImgList;
			}
		}
	}
	if (item.type === 'video') {
		const { height, width } = item.videoDetail;
		if (Number(height) > Number(width)) {
			// item.videoDetail.videoHeight = Number((height * screenWidth) / width).toFixed(0);
			let newWidth = screenWidth;
			newWidth = Number((screenWidth * 2) / 3).toFixed(0);
			item.videoDetail.videoWidth = newWidth;
			item.videoDetail.videoHeight = newWidth * 1.3 < height ? newWidth * 1.3 : height;
		}
	}
};

const getDeviceInfo = () => {
	return new Promise((resolve) => {
		// 菜单按钮的布局信息
		const menuDetail = wx.getMenuButtonBoundingClientRect();
		// 获取设备信息
		wx.getSystemInfo({
			success: function (res) {
				const { height: btnHeight, top: btnTop, width: btnWidth, right: btnRight } = menuDetail;
				const { screenHeight, statusBarHeight, screenWidth, system, pixelRatio, model, devicePixelRatio } = res;
				const headerHight = (btnTop - statusBarHeight) * 2 + statusBarHeight + btnHeight;
				const navHeight = headerHight - statusBarHeight;
				const disWidth = (screenWidth - btnRight) * 2 + btnWidth;
				const paddingLeft = screenWidth - btnRight;
				const paddingTop = btnTop - statusBarHeight;
				const conHegiht = navHeight - paddingTop * 2;
				resolve({
					screenHeight,
					screenWidth,
					system,
					pixelRatio,
					model,
					devicePixelRatio,
					headerHight,
					statusBarHeight,
					navHeight,
					conHegiht,
					disWidth,
					paddingLeft,
					paddingTop,
				});
			},
		});
	});
};

module.exports = {
	formatTime,
	getMsgShowTime,
	getDiffTime,
	getDeviceInfo,
	reloadHomePage,
	handleContentList,
	handleContentObj,
};
