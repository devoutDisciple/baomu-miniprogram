/* eslint-disable prefer-destructuring */
import login from '../../../utils/login';
import request from '../../../utils/request';
import deviceUtil from '../../../utils/deviceUtil';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		actorList: [], // 演员列表
		userDialogVisible: false, // 获取用户基本信息
		phoneDialogVisible: false, // 获取用户手机号弹框
		tabTop: '60px', // tab距离顶部的距离
		isLoading: false, // 是否在加载中
		currentUserPage: 0, // 当前演员的页码
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: '#000',
		});
		try {
			loading.showLoading();
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
			// 获取设备信息
			this.getDeviceStatus();

			// 查询演员
			await this.getActorList();
		} catch (error) {
			console.log(error);
		} finally {
			loading.hideLoading();
		}
	},

	// 页面滚动
	onPageScroll: function (e) {
		const { scrollTop } = e.detail;
		this.setData({ scrollOver: scrollTop > 210 });
	},

	/**
	 * 滑动到底部的时候
	 */
	onScrollBottom: function () {
		const { isLoading } = this.data;
		if (!isLoading) {
			this.setData({ isLoading: true }, async () => {
				await this.getActorList();
			});
		}
	},

	// 根据地理位置获取演员
	getActorList: async function () {
		const { currentUserPage, actorList } = this.data;
		const user_id = wx.getStorageSync('user_id');
		const actors = await request.get({
			url: '/user/userByLocation',
			data: { user_id: user_id, current: currentUserPage },
		});
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 2];
		const userIds = currentPage.data.userIds;
		// 将选取的user_id进行赋值
		actors.forEach((item) => {
			if (userIds.includes(item.id) && !Object.keys(item).includes('invitation')) {
				item.invitation = true;
			}
		});

		const newActorList = [...actorList, ...actors];

		this.setData({ actorList: newActorList, currentUserPage: currentUserPage + 1, isLoading: false });
	},

	// 获取设备信息
	getDeviceStatus: function () {
		deviceUtil.getDeviceInfo().then((res) => {
			const { statusBarHeight, navHeight } = res;
			const tabTop = `${statusBarHeight + navHeight}px`;
			this.setData({ tabTop });
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
			isHighAccuracy: true,
			type: 'gcj02',
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
												self.hadGetUserPermission();
											}
										},
									});
								} else {
									self.hadGetUserPermission();
								}
							},
						});
					}
				}
			},
		});
	},

	// 点击邀请
	onTapInvitation: function (e) {
		const { user_id } = e.detail;
		const { actorList } = this.data;
		const currItem = actorList.filter((item) => item.id === user_id)[0];
		currItem.invitation = !currItem.invitation;
		this.setData({ actorList: actorList });
	},

	// 点击确定
	onTapSureBtn: function () {
		const { actorList } = this.data;
		const user_ids = [];
		actorList.forEach((item) => {
			if (item.invitation) user_ids.push(item.id);
		});
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 2];
		console.log(currentPage.getUserDetails, 1212);
		currentPage.setData({ userIds: user_ids }, () => {
			wx.navigateBack({
				complete: () => {
					currentPage.getUserDetails();
				},
			});
		});
	},
});
