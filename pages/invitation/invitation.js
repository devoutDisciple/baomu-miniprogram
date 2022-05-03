import request from '../../utils/request';
import moment from '../../utils/moment';
import { instruments, PLAYS_STYLE, voices } from '../../constant/constant';
import loading from '../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		person_id: '', // 用户的id
		user_type: 1, // 1-个人 2-乐队
		teamDetail: {}, // 乐队详情
		dialogDetail: {}, // 弹框详情
		selectTimeRange: [],
		title: '',
		personDetail: {}, // 被雇佣人的详情
		playList: [], // 演奏方式
		playId: '', // 演奏方式id
		playName: '', // 演奏方式name
		instrumentList: [], // 选择乐器的list
		instrumentSelectId: '',
		instrumentSelectName: '',
		calendarVisible: false, // 日历开关
		startTime: '', // 日期开始时间
		endTime: '', // 日期结束时间
		selectDate: '', // 选择的日期区间
		hourList: [], // 时长list
		selectHour: '', // 选择的小时
		selectAddress: {
			name: '',
			address: '',
			latitude: '',
			longitude: '',
		}, // 演出地点
		isYesList: ['是', '否'],
		selectBargain: '', // 是否议价
		selectSend: '', // 是否接送
		selectFoods: '', // 是否包住宿
		desc: '', // 演出描述
		price: '', // 价格
		placeholder: '演出费用',
		referenceMoney: 0, // 参考费用
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		// 被邀请人的id, user_type: 1-个人 2-乐队
		const { person_id, user_type } = options;
		if (!person_id) {
			return wx.switchTab({
				url: '/pages/home/index/index',
			});
		}
		this.setData({ person_id, user_type }, async () => {
			loading.showLoading();
			await this.onSearchUserDetail();
			await this.getUserInvitationTime();
			loading.hideLoading();
		});
		// 获取所有演奏方式
		this.getAllPlayList();
		// 获取所有乐器类型
		this.getAllInstruments(instruments);
		// 获取演出时长
		this.generatorHourList();
	},

	// 查询用户详情
	onSearchUserDetail: async function () {
		const { person_id, user_type } = this.data;
		const detail = await request.get({ url: '/user/userDetail', data: { user_id: person_id } });
		this.setData({ personDetail: detail }, () => {
			// 如果是团队
			if (Number(user_type) === 2) {
				this.getTeamDetail();
			}
		});
	},

	// 获取用户已被邀请时段
	getUserInvitationTime: async function () {
		const { person_id } = this.data;
		const result = await request.get({ url: '/demand/invitationTime', data: { user_id: person_id } });
		const selectTimeRange = [];
		result.forEach((item) => {
			selectTimeRange.push({
				start_time: item.start_time,
				end_time: item.end_time,
				type: 1,
			});
		});
		this.setData({ selectTimeRange });
	},

	// 获取团队信息
	getTeamDetail: async function () {
		const { personDetail } = this.data;
		const result = await request.get({ url: '/team/detailByTeamId', data: { team_id: personDetail.team_id } });
		this.setData({ teamDetail: result || {} });
	},

	// 点击进去用户详情页面
	onGoToUserDetail: function () {
		const { personDetail } = this.data;
		wx.navigateTo({
			url: `/pages/personDetail/personDetail?user_id=${personDetail.id}`,
		});
	},

	// 获取所有演奏类型
	getAllPlayList: function () {
		const playList = [];
		PLAYS_STYLE.forEach((item) => playList.push(item.name));
		this.setData({ playList: playList || [] });
	},

	// 选择演奏类型
	onSelectPlay: function (e) {
		const { value } = e.detail;
		const { name, id } = PLAYS_STYLE[value];
		this.setData({ playName: name, playId: id, instrumentSelectName: '', instrumentSelectId: '' });
		// 获取所有乐器类型
		this.getAllInstruments(Number(value) === 1 ? voices : instruments);
	},

	// 获取所有乐器类型
	getAllInstruments: function (list) {
		const instrumentList = [];
		list.forEach((item) => instrumentList.push(item.name));
		this.setData({ instrumentList: instrumentList || [] });
	},

	// 选择乐器类型的时候
	onPickInstruments: function (e) {
		const { value } = e.detail;
		const { playId } = this.data;
		const tempList = Number(playId) === 1 ? instruments : voices;
		const { name, id } = tempList[value];
		this.setData({ instrumentSelectName: name, instrumentSelectId: id });
	},

	// 生成时长list
	generatorHourList: function () {
		const hourList = [];
		for (let index = 1; index < 17; index++) {
			hourList.push(index * 0.5);
		}
		this.setData({ hourList });
	},

	// calendarVisible 日历开关
	onChangeCalendarVisible: function () {
		const { calendarVisible } = this.data;
		this.setData({ calendarVisible: !calendarVisible });
	},

	// 选择日历确定
	onConfirmDate: function (e) {
		const { detail } = e;
		if (!detail || !Array.isArray(detail) || !detail[0]) {
			return wx.showToast({
				title: '请选择日期',
				icon: 'error',
			});
		}
		const startTime = moment(detail[0]).format('YYYY.MM.DD');
		const endTime = moment(detail[1]).format('YYYY.MM.DD');
		this.setData({ startTime, endTime, selectDate: `${startTime} - ${endTime}` });
		this.onChangeCalendarVisible();
		this.countPrice();
	},

	// 选择时长
	timePickSelect: function (e) {
		const { value } = e.detail;
		const selectHour = this.data.hourList[value];
		this.setData({ selectHour: `${selectHour}` });
		this.countPrice();
	},

	// 选择演出地点
	onChooseAddress: function () {
		const self = this;
		wx.chooseLocation({
			complete: function (res) {
				if (res.errMsg !== 'chooseLocation:ok') {
					return wx.showToast({
						title: '请选择地址',
						icon: 'error',
					});
				}
				const { address, latitude, longitude, name } = res;
				self.setData({ selectAddress: { address, latitude, longitude, name } });
			},
		});
	},

	// 选择是否议价
	onPickBargain: function (e) {
		const { value } = e.detail;
		const selectBargain = this.data.isYesList[value];
		this.setData({ selectBargain: selectBargain });
	},

	// 选择是否接送
	onPickSend: function (e) {
		const { value } = e.detail;
		const selectSend = this.data.isYesList[value];
		this.setData({ selectSend });
		this.countPrice();
	},

	// 选择是否包住宿
	onPickFoods: function (e) {
		const { value } = e.detail;
		const selectFoods = this.data.isYesList[value];
		this.setData({ selectFoods });
		this.countPrice();
	},

	// 当输入框失焦
	onIptBlur: function (e) {
		let { value } = e.detail;
		value = String(value).trim();
		this.setData({ title: value });
	},

	// 简介输入框失焦
	onBlurDesc: function (e) {
		let { value } = e.detail;
		value = String(value).trim();
		this.setData({ desc: value });
	},

	// 费用输入框失焦
	onBlurPrice: function (e) {
		let { value } = e.detail;
		value = Number(value);
		if (!(value > 0)) {
			return wx.showToast({
				title: '请输入费用',
				icon: 'error',
			});
		}
		const { referenceMoney } = this.data;
		if (Number(value) < Number(referenceMoney)) {
			this.setData({ price: '' });
			return wx.showToast({
				title: '输入费用过低',
				icon: 'error',
			});
		}
		this.setData({ price: value });
	},

	// 点击确定
	onTapSure: async function () {
		const self = this;
		setTimeout(async () => {
			const {
				person_id,
				user_type,
				teamDetail,
				title,
				playId,
				instrumentSelectId,
				startTime,
				endTime,
				selectBargain,
				selectHour,
				selectAddress,
				selectFoods,
				selectSend,
				desc,
				price,
			} = self.data;
			const user_id = wx.getStorageSync('user_id');
			if (!user_id || !person_id) {
				return wx.showToast({
					title: '发布失败',
					icon: 'error',
				});
			}
			if (
				!title ||
				!playId ||
				!instrumentSelectId ||
				!startTime ||
				!endTime ||
				!selectBargain ||
				!selectHour ||
				!selectAddress.address ||
				!desc ||
				!selectFoods ||
				!selectSend ||
				!price
			) {
				return wx.showToast({
					title: '请完善信息',
					icon: 'error',
				});
			}
			loading.showLoading();
			// 所有校验通过后，上传需求详情
			const params = {
				user_id: user_id,
				join_ids: person_id,
				user_type: 1, // 1-个人 2-乐队 3-乐团
				title: title,
				play_id: playId,
				instrument_id: instrumentSelectId,
				start_time: startTime,
				end_time: endTime,
				is_bargain: selectBargain === '是' ? 1 : 2,
				hours: selectHour,
				addressAll: selectAddress.address,
				addressName: selectAddress.name,
				latitude: selectAddress.latitude,
				longitude: selectAddress.longitude,
				desc: desc,
				is_food: selectFoods === '是' ? 1 : 2,
				is_send: selectSend === '是' ? 1 : 2,
				price: price,
				state: 1, // 需求开启竞价
				type: 2, // 1-发布需求 2-直接邀请的需求
			};
			// 如果邀请的是团队
			if (Number(user_type) === 2) {
				// 判断是否是团队成员
				const { user_ids } = teamDetail;
				const team_user_arr = user_ids.split(',');
				if (team_user_arr.includes(String(user_id))) {
					return wx.showToast({
						title: '队员不可邀请',
						icon: 'error',
					});
				}
				// 把邀请人换成队长
				params.join_ids = teamDetail.ower_id;
				// user_type 1-个人 2-乐队 3-乐团
				params.user_type = 2;
				params.team_id = teamDetail.id;
			}
			const res = await request.post({ url: '/demand/addDemand', data: params });
			loading.hideLoading();
			if (res === 'success') {
				self.setData({
					dialogDetail: {
						title: '邀请成功!',
						src: '/asserts/public/publish.png',
						desc: '请耐心等待对方确认!',
					},
					dialogVisible: true,
				});
			}
		}, 500);
	},

	// 计算费用
	countPrice: function () {
		let price = 400;
		const { startTime, endTime, selectHour, selectFoods, selectSend, user_type, teamDetail } = this.data;
		const temp_user_type = Number(user_type);
		let users_num = 0;
		if (temp_user_type === 2) {
			users_num = teamDetail.user_ids.split(',').length;
		}
		// 是乐团
		if (temp_user_type === 2) {
			// 400     *  人数
			price *= users_num;
		}
		// (（结束日期 — 开始日期）—1)  * 300
		if (startTime && endTime) {
			const days = moment(endTime).diff(moment(startTime), 'days') + 1;
			// 个人
			if (temp_user_type === 1) {
				price += Number(days - 1) * 300;
			} else {
				// 乐队
				price += Number(days - 1) * 260 * users_num;
			}
		}
		// 住宿否   +天数*200
		if (startTime && endTime && selectFoods && selectFoods === '否') {
			const days = moment(endTime).diff(moment(startTime), 'days') + 1;
			// 个人
			if (temp_user_type === 1) {
				price += days * 200;
			} else {
				// 乐队
				price += (Number(days) * 200 * users_num) / 2;
			}
		}
		// 当演奏时长>3               + 100
		if (selectHour && Number(selectHour) >= 3) {
			price += 100;
		}
		// 接送否                     +100
		if (selectSend && selectSend === '否') {
			price += 100;
		}
		if (startTime && endTime) {
			// 七天95折  14天9折  21天8.5折
			const days = moment(endTime).diff(moment(startTime), 'days') + 1;
			switch (days) {
				case Number(days) >= 21:
					price = Number(price) * 0.85;
					break;
				case Number(days) >= 14:
					price = Number(price) * 0.9;
					break;
				case Number(days) >= 7:
					price = Number(price) * 0.95;
					break;
				default:
					break;
			}
		}
		price = Number(price).toFixed(0);
		this.setData({ placeholder: `费用最低为：${price}元`, referenceMoney: price });
	},

	// 关闭提示弹框
	onCloseDialog: function () {
		this.setData({ dialogVisible: false });
		wx.switchTab({
			url: '/pages/home/index/index',
		});
	},
});
