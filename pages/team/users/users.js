import request from '../../../utils/request';
import { TEAM_USER_STATE } from '../../../constant/constant';
import loading from '../../../utils/loading';

// pages/team/users/users.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		usersList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { team_id } = options;
		this.setData({ team_id }, () => {
			this.onSearchUsers();
		});
	},

	// 查询成员
	async onSearchUsers() {
		loading.showLoading();
		const { team_id } = this.data;
		const result = await request.get({ url: '/team/teamsUsersByTeamId', data: { team_id } });
		if (Array.isArray(result)) {
			result.forEach((item) => {
				item.stateName = TEAM_USER_STATE.filter((state) => item.state === state.id)[0].name;
			});
		}
		this.setData({ usersList: result || [] });
		loading.hideLoading();
	},

	// 删除成员
	async onTapDeleteItem(e) {
		const { item } = e.currentTarget.dataset;
		const { id } = item;
		if (item.is_owner === 1) {
			return wx.showToast({
				title: '不可删除队长',
				icon: 'error',
			});
		}
		loading.showLoading();
		await request.post({ url: '/team/deleteTeamUser', data: { id } });
		loading.hideLoading();
		this.onSearchUsers();
		wx.showToast({
			title: '删除成功',
		});
	},
});
