import moment from '../../../utils/moment';
// eslint-disable-next-line import/named
import { getStoragePublishMsg, setStoragePublishMsg } from '../../../utils/util';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		calendarVisible: false, // 日历开关
		startTime: '',
		endTime: '',
		selectDate: '', // 选择的日期区间
		hourList: [], // 时长list
		selectHour: '', // 选择的小时
		selectAddress: {
			name: '',
			address: '',
			latitude: '',
			longitude: '',
		}, // 演出地点
		bargainList: ['是', '否'],
		selectBargain: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.generatorHourList();
		this.initMsg();
	},

	// 设置初始值
	initMsg: function () {
		const publish = getStoragePublishMsg('publish2');
		if (!publish) return;
		if (publish.selectAddress) this.setData({ selectAddress: publish.selectAddress });
		if (publish.bargain) this.setData({ selectBargain: publish.bargain });
		if (publish.hours) this.setData({ selectHour: `${publish.hours}小时/天` });
		if (publish.startTime && publish.endTime) {
			const { startTime, endTime } = publish;
			this.setData({
				startTime,
				endTime,
				selectDate: `${startTime} - ${endTime}`,
			});
		}
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
		setStoragePublishMsg('publish2', { startTime, endTime });
	},

	// 选择时长
	timePickSelect: function (e) {
		const { value } = e.detail;
		const selectHour = this.data.hourList[value];
		this.setData({ selectHour: `${selectHour} 小时/天` });
		setStoragePublishMsg('publish2', { hours: selectHour });
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
				setStoragePublishMsg('publish2', {
					selectAddress: { address, latitude, longitude, name },
				});
			},
		});
	},

	// 选择是否议价
	onPickBargain: function (e) {
		const { value } = e.detail;
		console.log(value, 111);
		const selectBargain = this.data.bargainList[value];
		this.setData({ selectBargain: selectBargain });
		setStoragePublishMsg('publish2', { bargain: selectBargain });
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
