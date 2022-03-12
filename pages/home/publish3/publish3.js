// eslint-disable-next-line import/named
import { getStoragePublishMsg, setStoragePublishMsg } from '../../../utils/util';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isYesList: ['是', '否'],
		selectSend: '', // 是否接送
		selectFoods: '', // 是否包食宿
		desc: '',
		price: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.initMsg();
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
	},

	// 选择是否包食宿
	onPickFoods: function (e) {
		const { value } = e.detail;
		const selectFoods = this.data.isYesList[value];
		this.setData({ selectFoods });
		setStoragePublishMsg('publish3', { foods: selectFoods });
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
		this.setData({ price: value });
		setStoragePublishMsg('publish3', { price: value });
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
