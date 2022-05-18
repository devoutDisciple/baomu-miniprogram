import loading from '../../utils/loading';
import request from '../../utils/request';
import moment from '../../utils/moment';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showHeader: false, // 是否展示滑动之后的header
		own_id: '', // 当前账户的id
		user_id: '', // 当前用户详情的用户id
		personDetail: {}, // 个人信息
		attentioned: 2, // 1- 已关注 2-未关注
		dialogShow: false,
		// 弹框的显示文案
		dialogDetail: {
			title: '',
			src: '',
			desc: '',
		},
		skillList: [], // 技能列表
		awardDetail: {}, // 获奖记录
		productionList: [], // 作品列表
		personShowList: [], // 动态列表
		showInvitationBtn: false, // 是否展示邀请按钮
		evaluates: [], // 评价列表
		invitationTime: [], // 被邀请时段
		is_first: true,
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
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 2];
		// 如果是从首页进来的，显示邀请按钮
		let showInvitationBtn = false;
		if (currentPage && currentPage.route === 'pages/home/index/index') {
			showInvitationBtn = true;
		}
		this.setData({ user_id: Number(user_id), own_id: Number(own_id), showInvitationBtn }, async () => {
			// 获取个人信息
			await this.getPersonDetail();
			// 获取是否关注
			await this.getIsAttention();
			// 获取个人技能列表
			await this.getUserSkill();
			// 获取个人获奖记录
			await this.getUserAward();
			// 获取作品列表
			await this.getPersonProduction();
			// 获取个人动态
			await this.getPersonShowList();
			// 获取用户全部评价
			await this.getUserEvaluates();
			// 获取用户的可用时段
			await this.getUserInvitationTime();
			this.setData({ is_first: false });
			loading.hideLoading();
		});
	},

	onShow: async function () {
		const { is_first } = this.data;
		if (!is_first) {
			// 获取个人信息
			await this.getPersonDetail();
			// 获取是否关注
			await this.getIsAttention();
			// 获取个人技能列表
			await this.getUserSkill();
			// 获取个人获奖记录
			await this.getUserAward();
			// 获取作品列表
			await this.getPersonProduction();
			// 获取个人动态
			await this.getPersonShowList();
			// 获取用户全部评价
			await this.getUserEvaluates();
			// 获取用户的可用时段
			await this.getUserInvitationTime();
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
	},

	// 获取个人是否关注该用户
	getIsAttention: async function () {
		const { user_id, own_id } = this.data;
		const result = await request.get({
			url: '/attention/userAttentionUser',
			data: { user_id: own_id, other_id: user_id },
		});
		this.setData({ attentioned: Number(result) });
	},

	// 获取作品展示
	getPersonProduction: async function () {
		const { user_id } = this.data;
		const productionList = await request.get({ url: '/user/productionList', data: { user_id, type: 1 } });
		this.setData({ productionList: productionList });
	},

	// 获取动态展示
	getPersonShowList: async function () {
		const { user_id } = this.data;
		const personShowList = await request.get({ url: '/user/productionList', data: { user_id, type: 2 } });
		this.setData({ personShowList: personShowList });
	},

	// 跳转到作品或者动态展示页面
	onTapProductionDetail: function (e) {
		const { type } = e.currentTarget.dataset;
		const { user_id } = this.data;
		wx.navigateTo({
			url: `/pages/my/productionShow/productionShow?user_id=${user_id}&type=${type}`,
		});
	},

	// 获取技能列表
	getUserSkill: async function () {
		const { user_id } = this.data;
		const lists = await request.get({ url: '/skill/all', data: { user_id } });
		lists.forEach((item) => {
			item.grade = Number(item.grade).toFixed(1);
			item.percent = Number((Number(item.grade) / 5) * 100).toFixed(0);
		});
		this.setData({ skillList: lists });
	},

	// 获取用户全部评价
	getUserEvaluates: async function () {
		const { user_id } = this.data;
		const result = await request.get({ url: '/demandEvaluate/allEvaluatesByUserId', data: { user_id } });
		this.setData({ evaluates: result || [] });
	},

	// 获取获奖记录
	getUserAward: async function () {
		const { user_id } = this.data;
		const detail = await request.get({ url: '/school/all', data: { user_id } });
		detail.certificate_time = moment(detail.certificate_time).format('YYYY年MM月');
		this.setData({ awardDetail: detail });
		loading.hideLoading();
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

	// 模拟数据存储
	setStoreageMsg: function () {
		const data = [];
		data.push({
			person_id: 17, // 发送信息的人
			person_name: '测试账号2', // 发送信息人的名字
			person_photo: 'http://localhost:8888/photo/D9SXV44EL168JNDW-1623772814994.png', // 发送信息人的头像
			noread: 11, // 未读信息数量
			msg: [
				{
					content: 'sjdfjdks',
					from: 2, // 1-代表自己发送的 2-别人发送的
					// "2021-11-12 12:00:00"
					time: '2021-11-12 12:00:00',
					type: 1, // 1-文字 2-图片
				},
			], // 具体信息
		});
		wx.setStorageSync('msg_data', JSON.stringify(data));
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
				msgType: 1, /// / 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
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

	// 获取用户已被邀请时段
	getUserInvitationTime: async function () {
		const { user_id } = this.data;
		const result = await request.get({ url: '/demand/invitationTime', data: { user_id } });
		this.setData({ invitationTime: result || [] });
	},

	// 点击邀请
	onTapInvitation: function () {
		const { user_id } = this.data;
		wx.navigateTo({
			url: `/pages/invitation/invitation?person_id=${user_id}`,
		});
	},

	// 预览头像
	onPreviewPhoto: function () {
		const { personDetail } = this.data;
		wx.previewImage({ urls: [personDetail.photo] });
	},

	// 点击背景图片
	onTapBgImg: function () {
		const { own_id, user_id } = this.data;
		if (Number(own_id) === Number(user_id)) {
			wx.navigateTo({
				url: '/pages/personDetailEdit/personDetailEdit',
			});
		}
	},

	// 查询已被邀请时段
	onSearchInvitationTime: function () {
		const { user_id } = this.data;
		if (user_id) {
			wx.navigateTo({
				url: `/pages/my/personCalendar/personCalendar?user_id=${user_id}`,
			});
		}
	},

	// 点击关注
	onTapAttention: async function (e) {
		let { type } = e.currentTarget.dataset;
		type = Number(type);
		loading.showLoading();
		const { own_id, user_id } = this.data;
		// 此时已关注
		if (type === 1) {
			const result = await request.post({
				url: '/attention/cancleAttention',
				data: { user_id: own_id, other_id: user_id },
			});
			if (result === 'success') {
				wx.showToast({
					title: '已取消关注',
				});
			}
		} else {
			const result = await request.post({ url: '/attention/add', data: { user_id: own_id, other_id: user_id } });
			if (result === 'success') {
				wx.showToast({
					title: '已关注',
				});
			}
		}
		setTimeout(() => {
			this.getIsAttention();
		}, 500);
		loading.hideLoading();
	},
});
