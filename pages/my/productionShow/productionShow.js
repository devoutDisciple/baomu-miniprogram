const request = require('../../../utils/request');
const loading = require('../../../utils/loading');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		owner_id: '',
		user_id: '',
		productionList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const user_id = options;
		const owner_id = wx.getStorageSync('user_id');
		this.setData({ user_id, owner_id }, () => {
			this.getProduction();
		});
	},

	// 获取作品
	getProduction: async function () {
		loading.showLoading();
		const { user_id } = this.data;
		const result = await request.get({ url: '/production/allByUserId', data: user_id });
		console.log(result, 1213);
		this.setData({ productionList: result });
		loading.hideLoading();
	},

	// 点击添加作品
	onTapAdd: function () {
		wx.navigateTo({
			url: '/pages/my/productionPublish/productionPublish',
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
