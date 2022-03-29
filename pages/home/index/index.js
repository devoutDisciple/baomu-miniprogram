/* eslint-disable prefer-destructuring */
import login from '../../../utils/login';
import request from '../../../utils/request';
import deviceUtil from '../../../utils/deviceUtil';
import loading from '../../../utils/loading';
import moment from '../../../utils/moment';
import { plays, instruments, voices } from '../../../constant/constant';
import config from '../../../config/config';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		selectTabIdx: 1, // 1-找演出 2-去演出
		actorList: [], // 演员列表
		demandsList: [], // 需求列表
		userDialogVisible: false, // 获取用户基本信息
		phoneDialogVisible: false, // 获取用户手机号弹框
		scrollOver: false, // 是否滑出输入框
		tabTop: '60px', // tab距离顶部的距离
		isLoading: false, // 是否在加载中
		currentUserPage: 0, // 当前演员的页码
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
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
			// 分享按钮
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage'],
			});
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
				const { selectTabIdx } = this.data;
				console.log(selectTabIdx, 23823);
				if (selectTabIdx === 1) {
					await this.getActorList();
				} else {
					// 查询需求
					await this.getDemandsList();
				}
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
		const newActorList = [...actorList, ...actors];
		this.setData({ actorList: newActorList, currentUserPage: currentUserPage + 1, isLoading: false });
	},

	// 获取需求
	getDemandsList: async function () {
		const user_id = wx.getStorageSync('user_id');
		const { demandsList, currentUserPage } = this.data;
		const demands = await request.get({
			url: '/demand/demandByAddress',
			data: { user_id: user_id, current: currentUserPage },
		});
		const result = [];
		if (Array.isArray(demands)) {
			const timeFormat = 'YYYY.MM.DD';
			demands.forEach((item) => {
				item.date = `${moment(item.start_time).format(timeFormat)} - ${moment(item.end_time).format(
					timeFormat,
				)}`;
				// 获取演奏类型
				const { name: playName } = plays.filter((p) => p.id === Number(item.play_id))[0];
				let instrItem = {};
				// 获取乐器类型
				if (item.play_id === 1) {
					instrItem = instruments.filter((p) => p.id === Number(item.instrument_id))[0];
				} else {
					instrItem = voices.filter((p) => p.id === Number(item.instrument_id))[0];
				}
				// eslint-disable-next-line prefer-const
				let { name: instrumentName, url: instrumentUrl } = instrItem;
				instrumentUrl = config.baseUrl + instrumentUrl;
				item = Object.assign(item, { playName, instrumentName, instrumentUrl });
				result.push(item);
			});
		}
		const newResult = [...demandsList, ...result];
		this.setData({ demandsList: newResult, currentUserPage: currentUserPage + 1, isLoading: false });
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

	// 点击发布需求
	onPublish: function () {
		wx.navigateTo({
			url: '/pages/home/publish1/publish1',
		});
	},

	// 选择去演出或者找演出
	onSelectTab: function (e) {
		let { idx } = e.currentTarget.dataset;
		idx = Number(idx);
		this.setData({ selectTabIdx: Number(idx), currentUserPage: 0 }, () => {
			if (idx === 1) {
				this.getActorList();
			} else {
				this.getDemandsList();
			}
		});
	},

	// 页面展示
	onShow: function () {
		// 清空发布的缓存
		wx.removeStorageSync('publish');
	},
});
