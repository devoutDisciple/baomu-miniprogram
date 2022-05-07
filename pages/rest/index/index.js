const loading = require('../../../utils/loading');
const request = require('../../../utils/request');

// pages/rest/index/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		selectTabIdx: 1,
		current: 1,
		deviceList: [], // 所有记录
		// -----筛选条件
		// address_select: '', // 选择的地址
		// team_type_id: '', // 乐团类型
		// team_type_name: '', // 乐团类型
		// person_style_id: '', // 擅长风格
		// person_style_name: '', // 擅长风格
		// plays_style_id: '', // 表演类型
		// plays_style_name: '', // 表演类型
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		loading.showLoading();
		await this.getAllDevices();
		loading.hideLoading();
	},

	// 滑动到页面底部
	onScrollBottom: function () {
		this.getAllDevices();
	},

	// 获取摄影棚
	getAllDevices: async function () {
		const { current, deviceList } = this.data;
		const list = await request.get({ url: '/device/allByPage', data: { current: current } });
		const newDeviceList = [...deviceList, ...list];
		this.setData({ deviceList: newDeviceList, current: current + 1 });
	},

	// 点击发布
	onTapPublish: function () {
		wx.navigateTo({
			url: '/pages/rest/publish/publish',
		});
	},
});
