import request from '../../../utils/request';
import { TEAM_USER_STATE, TEAM_USER_SKILL } from '../../../constant/constant';
import loading from '../../../utils/loading';

// pages/team/users/users.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isFirstTime: true,
		usersList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { team_id } = options;
		this.setData({ team_id, isFirstTime: false }, () => {
			this.onSearchUsers();
		});
	},

	onShow() {
		if (!this.data.isFirstTime) {
			this.onSearchUsers();
		}
	},

	// 查询成员
	async onSearchUsers() {
		loading.showLoading();
		const { team_id } = this.data;
		const result = await request.get({ url: '/team/teamsUsersByTeamId', data: { team_id } });
		if (Array.isArray(result)) {
			result.forEach((item) => {
				item.stateName = TEAM_USER_STATE.filter((state) => item.state === state.id)[0].name;
				const NEW_TEAM_USER_SKILL = [{ id: -1, name: '未知' }, ...TEAM_USER_SKILL];
				item.typeName = NEW_TEAM_USER_SKILL.filter((state) => item.type === state.id)[0].name;
			});
		}
		this.setData({ usersList: result || [] });
		loading.hideLoading();
	},

	// 编辑成员
	async onTapUserEdit(e) {
		const { id } = e.currentTarget.dataset.item;
		wx.navigateTo({
			url: `/pages/team/editUsers/editUsers?team_user_id=${id}`,
		});
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
