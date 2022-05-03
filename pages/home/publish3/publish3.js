// eslint-disable-next-line import/named
import { getStoragePublishMsg, setStoragePublishMsg } from '../../../utils/util';
import moment from '../../../utils/moment';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isYesList: ['是', '否'],
		selectSend: '', // 是否接送
		selectFoods: '', // 是否包住宿
		desc: '',
		price: '',
		placeholder: '演出费用',
		referenceMoney: 0, // 参考费用
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.initMsg();
	},

	// 计算费用
	onShow() {
		this.countPrice();
	},

	// 设置初始值
	initMsg: function () {
		const publish = getStoragePublishMsg('publish3');
		if (!publish) return;
		if (publish.foods) this.setData({ selectFoods: publish.foods });
		if (publish.send) this.setData({ selectSend: publish.send });
		if (publish.desc) this.setData({ desc: publish.desc });
		if (publish.price) this.setData({ price: Number(publish.price) });
	},

	// 选择是否接送
	onPickSend: function (e) {
		const { value } = e.detail;
		const selectSend = this.data.isYesList[value];
		this.setData({ selectSend });
		setStoragePublishMsg('publish3', { send: selectSend });
		this.countPrice();
	},

	// 选择是否包住宿
	onPickFoods: function (e) {
		const { value } = e.detail;
		const selectFoods = this.data.isYesList[value];
		this.setData({ selectFoods });
		setStoragePublishMsg('publish3', { foods: selectFoods });
		this.countPrice();
	},

	// 简介输入框失焦
	onBlurDesc: function (e) {
		let { value } = e.detail;
		value = String(value).trim();
		this.setData({ desc: value });
		setStoragePublishMsg('publish3', { desc: value });
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
		setStoragePublishMsg('publish3', { price: value });
	},

	// 计算费用
	countPrice: function () {
		let price = 400;
		const publish2 = getStoragePublishMsg('publish2') || {};
		const publish3 = getStoragePublishMsg('publish3') || {};
		const { startTime, endTime, hours } = publish2;
		const { send, foods } = publish3;
		if (startTime && endTime) {
			const days = moment(endTime).diff(moment(startTime), 'days') + 1;
			// (（结束日期 — 开始日期）—1)  * 300
			price += Number(days - 1) * 300;
		}
		// 住宿否   +天数*200
		if (startTime && endTime && publish3 && foods === '否') {
			const days = moment(endTime).diff(moment(startTime), 'days') + 1;
			price += days * 200;
		}
		// 当演奏时长>3               + 100
		if (hours && hours >= 3) {
			price += 100;
		}
		// 接送否                     +100
		if (publish3 && send === '否') {
			price += 100;
		}
		if (startTime && endTime) {
			// 七天95折  14天9折  21天8.5折
			const days = moment(endTime).diff(moment(startTime), 'days') + 1;
			switch (days) {
				case Number(days) >= 21:
					price = (Number(price) * 0.85).toFixed(0);
					break;
				case Number(days) >= 14:
					price = (Number(price) * 0.9).toFixed(0);
					break;
				case Number(days) >= 7:
					price = (Number(price) * 0.95).toFixed(0);
					break;
				default:
					break;
			}
		}
		this.setData({ placeholder: `费用最低为：${price}元`, referenceMoney: price });
	},
});
