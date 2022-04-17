// pages/team/accept/accept.js
import config from '../../../config/config';
import request from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		bgUrl: config.defaultPublishUrl,
		teamDetail: {},
		teamUsers: [], // 乐队成员
		teamUserState: 1, // 当前用户是否接受邀请 1-未参与(邀请阶段) 2-参与 3-已经拒绝
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { team_id } = options;
		if (!team_id) {
			return wx.navigateBack({});
		}
		this.setData({ team_id }, () => {
			this.onSearchTeamUserDetail();
			this.onSearchTeamDetail();
			this.onSearchTeamUser();
		});
	},

	// 根据团队id和个人id获取个人在乐队信息
	onSearchTeamUserDetail: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const { team_id } = this.data;
		const detail = await request.get({ url: '/team/teamUserDetail', data: { team_id: team_id, user_id } });
		this.setData({ teamUserState: detail.state });
		loading.hideLoading();
	},

	// 查询乐队详情
	onSearchTeamDetail: async function () {
		loading.showLoading();
		const { team_id } = this.data;
		const detail = await request.get({ url: '/team/detailByTeamId', data: { team_id: team_id } });
		this.setData({ teamDetail: detail });
		loading.hideLoading();
	},

	//  查询乐队成员
	onSearchTeamUser: async function () {
		loading.showLoading();
		const { team_id } = this.data;
		const teamUsers = await request.get({ url: '/team/teamsUsersByTeamId', data: { team_id: team_id } });
		this.setData({ teamUsers: teamUsers });
		loading.hideLoading();
	},

	// 点击成员头像
	onTapUserDetail: function (e) {
		const userDetail = e.currentTarget.dataset.item;
		wx.navigateTo({
			url: `/pages/personDetail/personDetail?user_id=${userDetail.id}`,
		});
	},

	// 点击接受或者拒绝
	onTapSure: async function (e) {
		let { state } = e.currentTarget.dataset;
		state = Number(state);
		loading.showLoading();
		const { team_id } = this.data;
		const user_id = wx.getStorageSync('user_id');
		await request.post({
			url: '/team/decisionInvitation',
			data: { team_id: team_id, user_id, state: state },
		});
		this.onSearchTeamUserDetail();
		loading.hideLoading();
		if (state === 2) {
			wx.showToast({
				title: '已接收邀请',
			});
		}
		if (state === 3) {
			wx.showToast({
				title: '已拒绝邀请',
			});
		}
	},
});
