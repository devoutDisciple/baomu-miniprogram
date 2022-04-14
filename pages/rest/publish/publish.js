import request from '../../../utils/request';
import moment from '../../../utils/moment';
import { instruments, PLAYS_STYLE, voices } from '../../../constant/constant';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		person_id: '', // 用户的id
		dialogDetail: {}, // 弹框详情
		selectTimeRange: [
			{
				start_time: '2022-03-02',
				end_time: '2022-03-21',
			},
		],
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
		selectFoods: '', // 是否包食宿
		desc: '', // 演出描述
		price: '', // 价格
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		// 被邀请人的id
		const user_id = wx.getStorageSync('user_id');
		this.setData({ person_id: user_id }, () => {
			this.onSearchUserDetail();
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
		const { person_id } = this.data;
		const detail = await request.get({ url: '/user/userDetail', data: { user_id: person_id } });
		this.setData({ personDetail: detail });
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
	},

	// 选择时长
	timePickSelect: function (e) {
		const { value } = e.detail;
		const selectHour = this.data.hourList[value];
		this.setData({ selectHour: `${selectHour}` });
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
	},

	// 选择是否包食宿
	onPickFoods: function (e) {
		const { value } = e.detail;
		const selectFoods = this.data.isYesList[value];
		this.setData({ selectFoods });
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
		this.setData({ price: value });
	},

	// 点击确定
	onTapSure: async function () {
		const self = this;
		setTimeout(async () => {
			const {
				person_id,
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
			loading.showLoading();
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
			// 所有校验通过后，上传需求详情
			const params = {
				user_id: user_id,
				join_ids: person_id,
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
			const res = await request.post({ url: '/demand/addDemand', data: params });
			if (res === 'success') {
				loading.hideLoading();
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

	// 关闭提示弹框
	onCloseDialog: function () {
		this.setData({ dialogVisible: false });
		wx.switchTab({
			url: '/pages/home/index/index',
		});
	},
});
