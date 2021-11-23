module.exports = {
	showLoading: () => {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		});
	},
	hideLoading: () => {
		wx.hideLoading();
	},
};
