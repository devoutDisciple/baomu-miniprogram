import request from '../../../utils/request';
import loading from '../../../utils/loading';

// pages/team/index/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		teamList: [],
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.getTeamListByUserId();
	},

	getTeamListByUserId: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/team/teamsByUserId', data: { user_id } });
		this.setData({ teamList: result });
		loading.hideLoading();
	},

	// 点击创建乐队
	onTapBtn: async function () {
		wx.navigateTo({
			url: '/pages/team/create/create',
		});
	},
});
