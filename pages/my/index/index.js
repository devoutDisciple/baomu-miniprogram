import deviceUtil from '../../../utils/deviceUtil';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: '80px',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getDeviceData();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	// 获取设备信息
	// 获取设备信息
	getDeviceData: function () {
		// 获取设备信息
		deviceUtil.getDeviceInfo().then((res) => {
			const { navHeight, statusBarHeight } = res;
			console.log(res, 2332);
			this.setData({
				statusHeight: `${navHeight + statusBarHeight}px`,
			});
		});
	},
});
