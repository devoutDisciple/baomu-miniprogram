import request from '../../../utils/request';

// pages/team/index/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		teamList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getTeamListByUserId();
	},

	getTeamListByUserId: async function () {
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/team/teamsByUserId', data: { user_id } });
		console.log(result, 111);
		this.setData({ teamList: result });
	},
});
