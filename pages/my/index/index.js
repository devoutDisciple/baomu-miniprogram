import deviceUtil from '../../../utils/deviceUtil';
import request from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: '80px', // 总高度
		statusBarHeight: '40px', // 上方状态栏高度
		showLoading: false, // 加载图标
		msgsNum: 0, // 未读消息数量
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		loading.showLoading();
		this.getDeviceData();
		await this.getUserInfo();
		this.getNoReadNum();
		loading.hideLoading();
		this.timer = setInterval(() => {
			this.getNoReadNum();
		}, 3000);
	},

	onShow: function () {
		this.getUserInfo();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},

	// 获取未读消息数量
	getNoReadNum: function () {
		const { msgsNum, demandsNum } = getApp().globalData;
		this.setData({ msgsNum: msgsNum, demandsNum });
		if (msgsNum || demandsNum) {
			wx.showTabBarRedDot({
				index: 4,
			});
		} else {
			wx.hideTabBarRedDot({
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
		if (type === 'team') this.jumpPage('/pages/team/index/index');
		// 我的评论
		if (type === 'comment') this.jumpPage('/pages/my/myReply/myReply');
		// 工作记录
		if (type === 'order') this.jumpPage('/pages/my/order/order');
		// 学校认证
		if (type === 'school') this.jumpPage('/pages/my/school/school');
		// 获奖认证
		if (type === 'award') this.jumpPage('/pages/my/award/award');
		// 实名认证
		if (type === 'shenfen') this.jumpPage('/pages/my/idcard/idcard');
		// 考级认证
		if (type === 'level') this.jumpPage('/pages/my/level/level');
		// 消息中心
		if (type === 'message') this.jumpPage('/pages/message/index/index');
		// 收支记录
		if (type === 'money') this.jumpPage('/pages/my/money/money');
		// 我的技能
		if (type === 'skill') this.jumpPage('/pages/my/skill/skill');
		// 照片墙
		if (type === 'photo') this.jumpPage('/pages/personDetailEdit/personDetailEdit');
		// 可预约时段
		if (type === 'pay') this.jumpPage('/pages/temPay/temPay');
		// 作品展示
		if (type === 'productionShow') {
			this.jumpPage(`/pages/my/productionShow/productionShow?user_id=${user_id}&type=1`);
		}
		// 去组团
		if (type === 'getTeam') this.jumpPage('/pages/team/create/create');
		// 工作地点
		if (type === 'address') {
			wx.chooseLocation({
				complete: function (res) {
					if (res.errMsg !== 'chooseLocation:ok') {
						return wx.showToast({
							title: '请重新选择',
							icon: 'error',
						});
					}
					const { latitude, longitude } = res;
					// 更新用户位置
					request.post({ url: '/user/updateLocation', data: { latitude, longitude, user_id } });
				},
			});
		}
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
