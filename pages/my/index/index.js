import deviceUtil from '../../../utils/deviceUtil';
import request from '../../../utils/request';
import loading from '../../../utils/loading';

const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: '80px', // 总高度
		statusBarHeight: '40px', // 上方状态栏高度
		showLoading: false, // 加载图标
		msgNum: 0, // 未读消息数量
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		loading.showLoading();
		this.getDeviceData();
		await this.getUserInfo();
		loading.hideLoading();
	},

	// 获取未读消息数量
	getNoReadNum: function () {
		const num = getApp().globalData.msgsNum;
		this.setData({ msgNum: num });
		if (num) {
			wx.setTabBarBadge({
				index: 4,
				text: String(num),
			});
		} else {
			wx.removeTabBarBadge({
				index: 4,
			});
		}
	},

	// 获取用户信息
	getUserInfo: async function () {
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/user/userDetail', data: { user_id } });
		this.setData({ userDetail: result });
	},

	// 点击用户头像
	onTapUserPhoto: function () {
		const user_id = wx.getStorageSync('user_id');
		wx.navigateTo({
			url: `/pages/personDetail/personDetail?user_id=${user_id}`,
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onShow: function () {
		this.getUserInfo();
		this.getNoReadNum();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.setData({ showLoading: true });
		setTimeout(() => {
			wx.stopPullDownRefresh({
				success: () => {
					this.setData({ showLoading: false });
				},
			});
		}, 500);
	},

	jumpPage: function (url) {
		wx.navigateTo({
			url: url,
		});
	},

	// 前往其他页面
	goOtherPage: function (e) {
		const { type } = e.currentTarget.dataset;
		const user_id = wx.getStorageSync('user_id');
		// 我的发布
		if (type === 'publish') this.jumpPage('/pages/my/myPublish/myPublish');
		// 我的乐队
		if (type === 'team') this.jumpPage('/pages/my/myPublish/myPublish');
		// 我的评论
		if (type === 'comment') this.jumpPage('/pages/my/myPublish/myPublish');
		// 工作记录
		if (type === 'order') this.jumpPage('/pages/my/order/order');
		// 获奖认证
		if (type === 'honor') this.jumpPage('/pages/my/school/school');
		// 实名认证
		if (type === 'shenfen') this.jumpPage('/pages/my/idcard/idcard');
		// 考级认证
		if (type === 'level') this.jumpPage('/pages/my/level/level');
		// 消息中心
		if (type === 'message') this.jumpPage('/pages/message/message');
		// 我的技能
		if (type === 'skill') this.jumpPage('/pages/my/skill/skill');
		// 照片墙
		if (type === 'photo') this.jumpPage('/pages/my/editPersonDetail/editPersonDetail');
		// 工作地点
		if (type === 'address') this.jumpPage('/pages/my/myPublish/myPublish');
		// 可预约时段
		if (type === 'time') this.jumpPage('/pages/my/myPublish/myPublish');
		// 作品展示
		if (type === 'productionShow') this.jumpPage(`/pages/my/productionShow/productionShow?user_id=${user_id}`);
		// 去组团
		if (type === 'getTeam') this.jumpPage('/pages/my/myPublish/myPublish');
		// 客服中心
		if (type === 'service') this.jumpPage('/pages/my/myPublish/myPublish');
	},

	// 获取设备信息
	getDeviceData: function () {
		// 获取设备信息
		deviceUtil.getDeviceInfo().then((res) => {
			const { navHeight, statusBarHeight } = res;
			this.setData({
				statusBarHeight: `${statusBarHeight}px`,
				statusHeight: `${navHeight + statusBarHeight}px`,
			});
		});
	},
});
