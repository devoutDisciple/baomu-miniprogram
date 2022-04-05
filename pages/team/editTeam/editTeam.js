import loading from '../../../utils/loading';
import request, { uploadFile } from '../../../utils/request';
import { TEAM_USER_STATE, TEAM_USER_SKILL } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isFirstTime: true, // 是否是第一次
		userIds: [], // 现有乐队成员id
		newAddUserIds: [], // 薪添加的乐队成员id
		user_id: '', // 当前乐队在user表的id
		team_id: '', // 当前乐队的id
		local_user_id: '', // 当前用户id
		personDetail: {}, // 乐队详情
		teamUsers: [], // 当前乐队成员的列表
		photo: '', // 用户头像
		nickname: '', // 用户昵称
		desc: '', // 乐队简介
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { user_id } = options;
		if (!user_id) {
			return wx.switchTab({
				url: '/pages/home/index/index',
			});
		}
		loading.showLoading();
		const local_user_id = wx.getStorageSync('user_id');
		this.setData({ user_id: Number(user_id), local_user_id: Number(local_user_id), isFirstTime: false }, () => {
			// 获取个人信息
			this.getPersonDetail();
		});
	},

	onShow() {
		if (this.data.isFirstTime) {
			// 获取个人信息
			this.getPersonDetail();
		}
	},

	// 获取个人信息
	getPersonDetail: async function () {
		const { user_id } = this.data;
		const personDetail = await request.get({ url: '/user/userDetail', data: { user_id } });
		this.setData({
			personDetail,
			photo: personDetail.photo,
			nickname: personDetail.nickname,
			desc: personDetail.desc,
			team_id: personDetail.team_id,
		});
		loading.hideLoading();
		// 获取乐队成员
		this.getTeamUser();
	},

	// 获取乐队成员
	getTeamUser: async function () {
		loading.showLoading();
		const { userIds, personDetail, local_user_id } = this.data;
		const result = await request.get({ url: '/team/teamsUsersByTeamId', data: { team_id: personDetail.team_id } });
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
		this.setData({ teamUsers: result || [], userIds });
		loading.hideLoading();
	},

	// 选择头像
	onChoosePhotoImg: function () {
		const self = this;
		const { user_id, team_id } = this.data;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				const { tempFilePaths } = res;
				self.setData({ photo: tempFilePaths[0] });
				const result = await uploadFile({
					url: '/team/upload',
					data: tempFilePaths[0],
					formData: { user_id, type: 1 },
				});
				await request.post({
					url: '/team/updateTeamDetail',
					data: { user_id, team_id, params: { photo: result.url } },
				});
			},
			fail: function () {
				wx.showToast({
					title: '请重新选择',
					icon: 'error',
				});
			},
		});
	},

	// 昵称焦点
	onBlurIpt: async function (e) {
		const { user_id, team_id } = this.data;
		const { value } = e.detail;
		if (!String(value).trim()) {
			return wx.showToast({
				title: '请输入昵称',
				icon: 'error',
			});
		}
		await request.post({
			url: '/team/updateTeamDetail',
			data: { user_id, team_id, params: { nickname: String(value).trim() } },
		});
	},

	// 简介焦点
	onBlurDesc: async function (e) {
		const { user_id, team_id } = this.data;
		const { value } = e.detail;
		if (!String(value).trim()) {
			return wx.showToast({
				title: '请输入简介',
				icon: 'error',
			});
		}
		await request.post({
			url: '/team/updateTeamDetail',
			data: { user_id, team_id, params: { desc: String(value).trim() } },
		});
	},

	// 点击添加乐队成员
	onTapInvitationUser: function () {
		wx.navigateTo({
			url: '/pages/team/invitation/invitation',
		});
	},

	// 添加新成员
	async addNewTeamUser() {
		const { newAddUserIds, team_id } = this.data;
		if (newAddUserIds.length === 0) return;
		loading.showLoading();
		await request.post({ url: '/team/addNewTeamUser', data: { team_id: team_id, userIds: newAddUserIds } });
		loading.hideLoading();
		this.getTeamUser();
	},
});
