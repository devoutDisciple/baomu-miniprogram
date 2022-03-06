import login from '../../../utils/login';
import request from '../../../utils/request';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		selectTabIdx: 2, // 1-找演出 2-去演出
		personList: [1, 2, 3, 4, 5, 6, 7, 8],
		taskList: [1, 2, 3, 4, 5, 6, 7, 8],
		userDialogVisible: false, // 获取用户基本信息
		phoneDialogVisible: false, // 获取用户手机号弹框
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		// 判断用户是否登录
		if (!login.isLogin()) {
			await login.getLogin();
		}
		// 判断是否已经获取用户手机号
		const phone = wx.getStorageSync('phone');
		const photo = wx.getStorageSync('photo');
		const username = wx.getStorageSync('username');
		if (!phone) {
			this.setData({ phoneDialogVisible: true });
		}
		if (!photo || !username) {
			this.setData({ userDialogVisible: true });
		}
		// 获取用户地理位置
		this.getUserLocation();
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage'],
		});
	},

	// 关闭获取用户信息弹框
	onCloseUserInfoDialog: function () {
		this.setData({ userDialogVisible: false });
	},

	// 关闭获取手机号弹框
	onClosePhoneDialog: function () {
		this.setData({ phoneDialogVisible: false });
	},

	// 获取用户位置
	getUserLocation: function () {
		const self = this;
		wx.getLocation({
			complete: function (res) {
				if (res.errMsg === 'getLocation:ok') {
					const { latitude, longitude } = res;
					const user_id = wx.getStorageSync('user_id');
					if (!user_id) return;
					// 更新用户位置
					request.post({ url: '/user/updateLocation', data: { latitude, longitude, user_id } });
				} else {
					self.hadGetUserPermission();
				}
			},
		});
	},

	// 检测用户是否已经授权地理位置
	hadGetUserPermission: function () {
		const self = this;
		wx.getSetting({
			complete: (res) => {
				if (res.errMsg === 'getSetting:ok') {
					if (!res.authSetting['scope.userLocation']) {
						wx.showModal({
							title: '您未开启地理位置授权',
							content: '为了为您提供更好的服务，请您授权地理位置信息的获取',
							success: (info) => {
								if (info.confirm) {
									wx.openSetting({
										success: function (setting) {
											if (setting.authSetting['scope.userLocation']) {
												// 表明此时已授权
												self.getUserLocation();
											} else {
												// 表明此时还不授权
												self.getUserLocation();
											}
										},
									});
								}
							},
						});
					}
				}
			},
		});
	},

	// 点击发布需求
	onPublish: function () {
		wx.navigateTo({
			url: '/pages/home/publish1/publish1',
		});
	},

	// 选择去演出或者找演出
	onSelectTab: function (e) {
		const { idx } = e.currentTarget.dataset;
		this.setData({ selectTabIdx: Number(idx) });
	},

	// 页面展示
	onShow: function () {
		console.log(1111);
	},

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
