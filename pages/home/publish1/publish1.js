import request from '../../../utils/request';
// eslint-disable-next-line import/named
import { getStoragePublishMsg, setStoragePublishMsg } from '../../../utils/util';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		instruments: [], // 所有的乐器
		instrumentList: ['小提琴演奏', '钢琴演奏'],
		instrumentSelectName: '',
		instrumentSelectId: '',
		title: '', // 需求名称
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		await this.getAllInstruments();
		this.initMsg();
	},

	initMsg: function () {
		const publish = getStoragePublishMsg('publish1');
		if (publish && publish.title) {
			const { instruments } = this.data;
			const { id, name } = instruments.filter((item) => item.id === publish.instrumentSelectId)[0];
			this.setData({ title: publish.title, instrumentSelectId: id, instrumentSelectName: name });
		}
	},

	// 获取所有乐器
	getAllInstruments: async function () {
		const results = await request.get({ url: '/instrument/allBySelect' });
		const instrumentList = [];
		results.forEach((item) => instrumentList.push(item.name));
		this.setData({ instruments: results || [], instrumentList: instrumentList || [] });
	},

	bindPickerChange: function (e) {
		const { value } = e.detail;
		const { instruments } = this.data;
		const instrumentSelectItem = instruments[value];
		const { name, id } = instrumentSelectItem;
		this.setData({ instrumentSelectName: name, instrumentSelectId: id });
		setStoragePublishMsg('publish1', { instrumentSelectId: id });
	},

	// 当输入框失焦
	onIptBlur: function (e) {
		let { value } = e.detail;
		value = String(value).trim();
		this.setData({ title: value });
		setStoragePublishMsg('publish1', { title: value });
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
