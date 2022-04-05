import loading from '../../../utils/loading';
import request from '../../../utils/request';
import { instruments, TEAM_USER_STATE, TEAM_USER_SKILL } from '../../../constant/constant';
import login from '../../../utils/login';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		firstTime: true, // 是否是第一次
		showHeader: false, // 是否展示滑动之后的header
		own_id: '', // 当前账户的id
		user_id: '', // 当前用户的id
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
		const own_id = wx.getStorageSync('user_id');
		this.setData({ user_id: Number(user_id), own_id: Number(own_id), firstTime: false }, () => {
			// 获取个人信息
			this.getPersonDetail();
			// 获取一个作品和一个动态
			this.getTeamOneProduction();
		});
	},

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

	onScroll: function (e) {
		const { scrollTop } = e.detail;
		this.setData({ showHeader: scrollTop > 126 });
	},

	// 获取个人信息
	getPersonDetail: async function () {
		const { user_id } = this.data;
		const personDetail = await request.get({ url: '/user/userDetail', data: { user_id } });
		this.setData({ personDetail });
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
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/production/teamOneProductions', data: { user_id } });
		if (result && result.length !== 0) {
			result.forEach((item) => {
				item.instr_name = instruments.filter((ins) => ins.id === item.instr_id)[0].name;
			});
		}
		const [production1, production2] = result;
		this.setData({ production1: production1 || {}, production2: production2 || {} });
		loading.hideLoading();
	},

	// 获取乐队成员
	getTeamUser: async function () {
		const { personDetail } = this.data;
		loading.showLoading();
		let result = await request.get({ url: '/team/teamsUsersByTeamId', data: { team_id: personDetail.team_id } });
		if (Array.isArray(result)) {
			result.forEach((item) => {
				item.stateName = TEAM_USER_STATE.filter((state) => item.state === state.id)[0].name;
				const NEW_TEAM_USER_SKILL = [{ id: -1, name: '未知' }, ...TEAM_USER_SKILL];
				item.typeName = NEW_TEAM_USER_SKILL.filter((state) => item.type === state.id)[0].name;
			});
		}
		// 最多展示四个
		result = result.splice(0, 4);
		this.setData({ teamUsers: result });
		loading.hideLoading();
	},

	// 跳转到作品或者动态展示页面
	onTapProductionDetail: function (e) {
		const { type } = e.currentTarget.dataset;
		const { user_id } = this.data;
		wx.navigateTo({
			url: `/pages/my/productionShow/productionShow?user_id=${user_id}&type=${type}`,
		});
	},

	// 点击乐队成员
	onTapSerachUser: function () {
		const { personDetail } = this.data;
		wx.navigateTo({
			url: `/pages/team/users/users?team_id=${personDetail.team_id}`,
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
		const { personDetail } = this.data;
		let msgData = wx.getStorageSync('msg_data');
		let data = [
			{
				person_id: personDetail.id,
				person_name: personDetail.nickname,
				person_photo: personDetail.photo,
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
					if (item.person_id === personDetail.id) {
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
			url: `/pages/chat/chat?person_id=${personDetail.id}`,
		});
	},
});
