import request from '../../utils/request';
import moment from '../../utils/moment';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		selectTimeRange: [
			{
				start_time: '2022-03-02',
				end_time: '2022-03-21',
			},
		],
		instrumentList: [], // 乐器的列表
		instrumentSelectName: '', // 选择乐器的名称
		instrumentSelectId: '', // 选择乐器的id
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
		selectPrice: '', // 是否议价
		selectSend: '', // 是否接送
		selectFoods: '', // 是否包食宿
		desc: '', // 演出描述
		price: '', // 价格
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getAllInstruments();
		this.generatorHourList();
	},

	// 获取所有乐器
	getAllInstruments: async function () {
		const results = await request.get({ url: '/instrument/allBySelect' });
		const instrumentList = [];
		results.forEach((item) => instrumentList.push(item.name));
		this.setData({ instruments: results || [], instrumentList: instrumentList || [] });
	},

	// 选择乐器
	onPickInstruments: function (e) {
		const { value } = e.detail;
		const { instruments } = this.data;
		const instrumentSelectItem = instruments[value];
		const { name, id } = instrumentSelectItem;
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
		this.setData({ selectHour: `${selectHour} 小时/天` });
	},

	// 选择演出地点
	onChooseAddress: function () {
		const self = this;
		wx.chooseLocation({
			complete: function (res) {
				if (res.errMsg !== 'chooseLocation:ok') {
					return wx.wx.showToast({
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
	onPickPrice: function (e) {
		const { value } = e.detail;
		const selectPrice = this.data.isYesList[value];
		this.setData({ selectPrice: selectPrice });
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
