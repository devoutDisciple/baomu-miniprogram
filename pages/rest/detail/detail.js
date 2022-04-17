// pages/rest/detail/detail.js
import request from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		detail: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { id } = options;
		this.setData({ id }, () => {
			this.getDeviceDetail();
		});
	},

	// 获取摄影棚详情
	getDeviceDetail: async function () {
		loading.showLoading();
		const { id } = this.data;
		const result = await request.get({ url: '/device/deviceDetailById', data: { id } });
		console.log(result, 111);
		this.setData({ detail: result });
		loading.hideLoading();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {},
});
