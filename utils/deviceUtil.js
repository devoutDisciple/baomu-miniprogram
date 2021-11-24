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
	getDeviceInfo,
};
