import loading from '../../utils/loading';
import request from '../../utils/request';
import { skills } from '../../constant/constant';
import moment from '../../utils/moment';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showHeader: false, // 是否展示滑动之后的header
		own_id: '', // 当前账户的id
		user_id: '', // 当前用户的id
		personDetail: {}, // 个人信息
		dialogShow: false,
		// 弹框的显示文案
		dialogDetail: {
			title: '',
			src: '',
			desc: '',
		},
		skillList: [], // 技能列表
		awardDetail: {}, // 获奖记录
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
		this.setData({ user_id: Number(user_id), own_id: Number(own_id) }, () => {
			// 获取个人信息
			this.getPersonDetail();
			// 获取个人技能列表
			this.getUserSkill();
			// 获取个人获奖记录
			this.getUserAward();
		});
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
	},

	// 获取技能列表
	getUserSkill: async function () {
		const { user_id } = this.data;
		const lists = await request.get({ url: '/skill/all', data: { user_id } });
		lists.forEach((item) => {
			item.skillName = skills.filter((skill) => skill.id === item.skill_id)[0].name;
			item.grade = Number(item.grade).toFixed(1);
			item.percent = Number((Number(item.grade) / 5) * 100).toFixed(0);
		});
		this.setData({ skillList: lists });
		loading.hideLoading();
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
		this.setStoreageMsg();
		let { userDetail } = this.data;
		userDetail = {
			id: 17,
			username: '测试账号2',
			photo: 'http://localhost:8888/photo/D9SXV44EL168JNDW-1623772814994.png',
		};
		let msgData = wx.getStorageSync('msg_data');
		let data = [
			{
				person_id: userDetail.id,
				person_name: userDetail.username,
				person_photo: userDetail.photo,
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
					if (item.person_id === userDetail.id) {
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
			url: `/pages/chat/chat?person_id=${userDetail.id}`,
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
