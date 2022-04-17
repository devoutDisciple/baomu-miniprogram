import request from '../../../utils/request';
import { TEAM_USER_STATE, TEAM_USER_SKILL } from '../../../constant/constant';
import loading from '../../../utils/loading';

// pages/team/users/users.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userIds: [], // 现有乐队成员id
		newAddUserIds: [], // 薪添加的乐队成员id
		isFirstTime: true,
		usersList: [],
		team_id: '', // 团队id
		teamDetail: {}, // 乐队详情
		team_leader_id: '', // 乐队领导id
		is_team_leader: false, // 是否是团队队长
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { team_id } = options;
		this.setData({ team_id, isFirstTime: false }, () => {
			// 查询成员
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
		const { team_id, userIds } = this.data;
		const local_user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/team/teamsUsersByTeamId', data: { team_id, type: 2 } });
		if (Array.isArray(result)) {
			result.forEach((item) => {
				// 1-队长 2-队员
				if (item.is_owner === 1) {
					const is_team_leader = Number(item.user_id) === Number(local_user_id);
					// 保留团队队长id
					this.setData({ team_leader_id: item.user_id, is_team_leader: is_team_leader });
				}
				item.stateName = TEAM_USER_STATE.filter((state) => item.state === state.id)[0].name;
				const NEW_TEAM_USER_SKILL = [{ id: -1, name: '未知' }, ...TEAM_USER_SKILL];
				item.typeName = NEW_TEAM_USER_SKILL.filter((state) => item.type === state.id)[0].name;
				userIds.push(item.user_id);
			});
		}
		this.setData({ usersList: result || [], userIds });
		loading.hideLoading();
	},

	// 查询乐队详情
	async onSearchTeamDetail() {
		const { team_id } = this.data;
		const teamDetail = await request.get({ url: '/team/detailByTeamId', data: { team_id: team_id } });
		this.setData({ teamDetail: teamDetail });
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
		const { id: team_user_id, user_id } = item;
		const { team_id } = this.data;
		if (item.is_owner === 1) {
			return wx.showToast({
				title: '不可删除队长',
				icon: 'error',
			});
		}
		loading.showLoading();
		await request.post({ url: '/team/deleteTeamUser', data: { team_user_id, user_id, team_id } });
		loading.hideLoading();
		this.onSearchUsers();
		wx.showToast({
			title: '删除成功',
		});
	},

	// 点击单个成员
	onTapUserDetail: function (e) {
		const { userid } = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/personDetail/personDetail?user_id=${userid}`,
		});
	},

	// 添加新成员
	async addNewTeamUser() {
		const { newAddUserIds, team_id } = this.data;
		if (newAddUserIds.length === 0) return;
		loading.showLoading();
		await request.post({ url: '/team/addNewTeamUser', data: { team_id: team_id, userIds: newAddUserIds } });
		loading.hideLoading();
		this.onSearchUsers();
	},

	// 点击邀请成员
	onTapInvitationBtn() {
		wx.navigateTo({
			url: '/pages/team/invitation/invitation',
		});
	},
});
