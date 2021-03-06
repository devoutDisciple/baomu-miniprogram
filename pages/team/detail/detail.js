import loading from '../../../utils/loading';
import request from '../../../utils/request';
import { instruments, TEAM_USER_STATE } from '../../../constant/constant';
import login from '../../../utils/login';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		firstTime: true, // 是否是第一次
		showHeader: false, // 是否展示滑动之后的header
		local_user_id: '', // 当前账户的id
		team_leader_id: '', // 队长id
		is_team_leader: false, // 是否是队长 默认不是
		user_id: '', // 当前用户的id
		teamLeaderDetail: {}, // 队长信息
		personDetail: {}, // 个人信息
		teamUsers: [], // 乐队成员
		dialogShow: false,
		// 弹框的显示文案
		dialogDetail: {
			title: '',
			src: '',
			desc: '',
		},
		production1: {}, // 作品列表
		production2: {}, // 动态列表
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { user_id } = options;
		if (!user_id) {
			return wx.switchTab({
				url: '/pages/home/index/index',
			});
		}
		loading.showLoading();
		const local_user_id = wx.getStorageSync('user_id');
		this.setData(
			{
				user_id: Number(user_id),
				local_user_id: Number(local_user_id),
			},
			() => {
				// 获取个人信息
				this.getPersonDetail();
				// 获取一个作品和一个动态
				this.getTeamOneProduction();
			},
		);
	},

	// 页面显示的时候
	onShow: function () {
		const { firstTime } = this.data;
		if (!firstTime) {
			loading.showLoading();
			// 获取个人信息
			this.getPersonDetail();
			// 获取一个作品和一个动态
			this.getTeamOneProduction();
		}
	},

	// 页面滚动的时候
	onScroll: function (e) {
		const { scrollTop } = e.detail;
		this.setData({ showHeader: scrollTop > 126 });
	},

	// 获取个人信息
	getPersonDetail: async function () {
		const { user_id } = this.data;
		const personDetail = await request.get({ url: '/user/userDetail', data: { user_id } });
		this.setData({ personDetail, firstTime: false });
		loading.hideLoading();
		// 获取乐队成员
		this.getTeamUser();
	},

	// 获取一个作品和一个动态
	getTeamOneProduction: async function () {
		loading.showLoading();
		if (!login.isLogin()) {
			await login.getLogin();
		}
		const { user_id } = this.data;
		const result = await request.get({ url: '/production/teamOneProductions', data: { user_id } });
		let production1 = {};
		let production2 = {};
		if (result && result.length !== 0) {
			result.forEach((item) => {
				item.instr_name = instruments.filter((ins) => ins.id === item.instr_id)[0].name;
				if (Number(item.type) === 1) production1 = item;
				if (Number(item.type) === 2) production2 = item;
			});
		}
		this.setData({ production1: production1 || {}, production2: production2 || {} });
		loading.hideLoading();
	},

	// 获取乐队成员
	getTeamUser: async function () {
		const { personDetail, local_user_id } = this.data;
		loading.showLoading();
		let result = await request.get({
			url: '/team/teamsUsersByTeamId',
			data: { team_id: personDetail.team_id, type: 1 },
		});
		if (Array.isArray(result)) {
			result.forEach((item) => {
				// 1-队长 2-队员
				if (item.is_owner === 1) {
					const is_team_leader = Number(item.user_id) === Number(local_user_id);
					// 保留团队队长id
					this.setData({ team_leader_id: item.user_id, is_team_leader: is_team_leader }, () => {
						this.getTeamLeaderDetail();
					});
				}
				item.stateName = TEAM_USER_STATE.filter((state) => item.state === state.id)[0].name;
				item.typeName = item.type || '';
			});
		}
		// 最多展示四个
		result = result.splice(0, 4);
		this.setData({ teamUsers: result });
		loading.hideLoading();
	},

	// 获取队长详情
	getTeamLeaderDetail: async function () {
		loading.showLoading();
		const { team_leader_id } = this.data;
		const result = await request.get({ url: '/user/userDetail', data: { user_id: team_leader_id } });
		this.setData({ teamLeaderDetail: result });
		loading.hideLoading();
	},

	// 点击编辑按钮
	onTapEdit: function () {
		const { user_id } = this.data;
		wx.navigateTo({
			url: `/pages/team/editTeam/editTeam?user_id=${user_id}`,
		});
	},

	// 跳转到作品或者动态展示页面
	onTapProductionDetail: function (e) {
		const { type } = e.currentTarget.dataset;
		const { user_id, local_user_id, teamUsers } = this.data;
		const isTeamer = !!teamUsers.filter((item) => item.user_id === local_user_id)[0];
		// return;
		wx.navigateTo({
			url: `/pages/my/productionShow/productionShow?user_id=${user_id}&type=${type}&showPublishBtn=${isTeamer}`,
		});
	},

	// 点击全部成员
	onTapSerachUser: function () {
		const { personDetail } = this.data;
		wx.navigateTo({
			url: `/pages/team/users/users?team_id=${personDetail.team_id}`,
		});
	},

	// 点击单个成员
	onTapUserDetail: function (e) {
		const { userid } = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/personDetail/personDetail?user_id=${userid}`,
		});
	},

	// 点击标识
	onTapSign: function (e) {
		const { idx } = e.currentTarget.dataset;
		let dialogDetail = {};
		switch (idx) {
			case 1:
				dialogDetail = {
					title: '实名认证标识',
					src: '/asserts/public/renzhengbiaoshi.png',
					desc: '有此标识的用户通过平台审核身份真实有效',
				};
				break;
			case 2:
				dialogDetail = {
					title: '毕业院校认证标识',
					src: '/asserts/public/yuanxiaorenzheng.png',
					desc: '有此标识的用户通过平台审核身份真实有效',
				};
				break;
			case 3:
				dialogDetail = {
					title: '荣获奖项认证标识',
					src: '/asserts/public/huojiangrenzheng.png',
					desc: '此用户在xx届钢琴比赛中荣获1等级',
				};
				break;
			case 4:
				dialogDetail = {
					title: '专业考级认证标识',
					src: '/asserts/public/kaojirenzheng.png',
					desc: '此用户钢琴考级已过8级',
				};
				break;
			default:
				break;
		}
		this.setData({ dialogDetail, dialogShow: true });
	},

	// 点击关闭弹框
	onCloseDialog: function () {
		this.setData({ dialogShow: false });
	},

	// 点击发送信息
	onTapMsg: function () {
		const { teamLeaderDetail } = this.data;
		let msgData = wx.getStorageSync('msg_data');
		let data = [
			{
				person_id: teamLeaderDetail.id,
				person_name: teamLeaderDetail.nickname,
				person_photo: teamLeaderDetail.photo,
				noread: 0,
				msg: [],
			},
		];
		if (msgData) {
			msgData = JSON.parse(msgData);
			if (Array.isArray(msgData)) {
				let flag = true;
				let curUser = {};
				let curIdx = 0;
				// 应当判断是否已经给该用户发过消息
				msgData.forEach((item, index) => {
					if (item.person_id === teamLeaderDetail.id) {
						flag = false;
						curUser = item;
						curIdx = index;
					}
				});
				if (flag) {
					data = [...data, ...msgData];
				} else {
					msgData.splice(curIdx, 1);
					msgData.unshift(curUser);
					data = msgData;
				}
			}
		}
		wx.setStorageSync('msg_data', JSON.stringify(data));
		wx.navigateTo({
			url: `/pages/chat/chat?person_id=${teamLeaderDetail.id}`,
		});
	},

	// 点击解散乐队
	onTapDissolveTeam: function () {
		const { personDetail } = this.data;
		wx.showModal({
			title: '确定解散该乐队?',
			content: '此过程不可逆，请确认是否解散该乐队',
			confirmText: '确认解散',
			confirmColor: '#ff0000',
			complete: async (e) => {
				if (e.errMsg === 'showModal:ok' && e.confirm) {
					await request.post({
						url: '/team/cancelTeam',
						data: { user_id: personDetail.id, team_id: personDetail.team_id },
					});
					wx.showToast({
						title: '解散成功',
					});
					setTimeout(() => {
						wx.switchTab({
							url: '/pages/home/index/index',
						});
					}, 1000);
				}
			},
		});
	},
});
