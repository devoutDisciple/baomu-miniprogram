/* eslint-disable prefer-destructuring */
import login from '../../../utils/login';
import request from '../../../utils/request';
import deviceUtil from '../../../utils/deviceUtil';
import loading from '../../../utils/loading';
import moment from '../../../utils/moment';
import { PLAYS_STYLE, instruments, voices } from '../../../constant/constant';
import config from '../../../config/config';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		selectTabIdx: 2, // 1-找演出 2-去演出
		actorList: [], // 演员列表
		demandsList: [], // 需求列表
		userDialogVisible: false, // 获取用户基本信息
		phoneDialogVisible: false, // 获取用户手机号弹框
		scrollOver: false, // 是否滑出输入框
		tabTop: '60px', // tab距离顶部的距离
		isLoading: false, // 是否在加载中
		currentUserPage: 0, // 当前演员的页码
		// -----筛选条件
		address_select: '', // 选择的地址
		team_type_id: '', // 乐团类型
		team_type_name: '', // 乐团类型
		person_style_id: '', // 擅长风格
		person_style_name: '', // 擅长风格
		plays_style_id: '', // 演奏方式
		plays_style_name: '', // 演奏方式
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		try {
			// 判断用户是否登录
			if (!login.isLogin()) {
				await login.getLogin();
			}
			loading.showLoading();
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
			// 获取设备信息
			this.getDeviceStatus();
			// 获取用户地理位置, 获取用户位置之后在进行查询
			this.getUserLocation();
			// 分享按钮
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage'],
			});
		} finally {
			loading.hideLoading();
		}
	},

	// 查询，给查询页面用的
	onSearch: async function () {
		const { selectTabIdx } = this.data;
		loading.showLoading();
		if (Number(selectTabIdx) === 1) {
			// 查询演员
			await this.getActorList(true);
		} else {
			// 查询需求
			await this.getDemandsList(true);
		}
		loading.hideLoading();
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
	getActorList: async function (is_clear) {
		try {
			if (is_clear) loading.showLoading();
			const { currentUserPage, actorList, address_select, person_style_id, plays_style_id, team_type_id } =
				this.data;
			const user_id = wx.getStorageSync('user_id');
			const actors = await request.get({
				url: '/user/userByLocation',
				data: {
					user_id: user_id,
					current: is_clear ? 0 : currentUserPage,
					address_select,
					person_style_id,
					plays_style_id,
					team_type_id,
				},
			});
			if (is_clear) {
				return this.setData({ actorList: actors, currentUserPage: 1, isLoading: false });
			}
			const newActorList = [...actorList, ...actors];
			this.setData({ actorList: newActorList, currentUserPage: currentUserPage + 1, isLoading: false });
		} finally {
			if (is_clear) loading.hideLoading();
		}
	},

	handDeamndsData: function (demands) {
		if (!Array.isArray(demands) || demands.length === 0) {
			return [];
		}
		const result = [];
		const timeFormat = 'YYYY.MM.DD';
		demands.forEach((item) => {
			item.date = `${moment(item.start_time).format(timeFormat)} - ${moment(item.end_time).format(timeFormat)}`;
			// 获取演奏类型
			const { name: playName } = PLAYS_STYLE.filter((p) => p.id === Number(item.play_id))[0];
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
		return result;
	},

	// 获取需求
	getDemandsList: async function (is_clear) {
		if (is_clear) loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const { demandsList, currentUserPage, address_select, plays_style_id } = this.data;
		const demands = await request.get({
			url: '/demand/demandByAddress',
			data: { user_id: user_id, current: is_clear ? 0 : currentUserPage, address_select, plays_style_id },
		});
		const result = this.handDeamndsData(demands);
		if (is_clear) {
			return this.setData({ demandsList: result, currentUserPage: 1, isLoading: false });
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
		const { selectTabIdx } = this.data;
		wx.getLocation({
			isHighAccuracy: true,
			type: 'gcj02',
			complete: async function (res) {
				if (res.errMsg === 'getLocation:ok') {
					const { latitude, longitude } = res;
					const user_id = wx.getStorageSync('user_id');
					if (!user_id) return;
					// 更新用户位置
					const result = await request.post({
						url: '/user/updateLocation',
						data: { latitude, longitude, user_id },
					});
					console.log(result, 1111);
					const { city } = result;
					self.setData({ address_select: city }, async () => {
						self.onSearch();
					});
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
			this.onSearch();
		});
	},

	// 页面展示
	onShow: function () {
		// 清空发布的缓存
		wx.removeStorageSync('publish');
	},

	// 当选择条件改变的时候
	onChangeConditions: function (e) {
		const { address_select, person_style_id, plays_style_id, team_type_id } = e.detail;
		this.setData({ address_select, person_style_id, plays_style_id, team_type_id }, () => {
			this.onSearch();
		});
	},

	// 输入框搜索
	onIptSearch: async function (e) {
		const { selectTabIdx } = this.data;
		const { value } = e.detail;
		if (!value) {
			return this.setData({ isLoading: true }, () => {
				this.onSearch();
			});
		}
		const user_id = wx.getStorageSync('user_id');
		loading.showLoading();
		if (selectTabIdx === 1) {
			const actors = await request.get({ url: '/user/userBySearchValue', data: { value: value, user_id } });
			this.setData({ actorList: actors, currentUserPage: 0, isLoading: true });
		} else {
			const demands = await request.get({
				url: '/demand/deamandByIptValue',
				data: { value: value, user_id },
			});
			const result = this.handDeamndsData(demands);
			this.setData({ demandsList: result, currentUserPage: 0, isLoading: true });
		}
		loading.hideLoading();
	},
});
