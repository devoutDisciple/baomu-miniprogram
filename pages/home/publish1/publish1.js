// import request from '../../../utils/request';
import { instruments, plays, voices } from '../../../constant/constant';
// eslint-disable-next-line import/named
import { getStoragePublishMsg, setStoragePublishMsg } from '../../../utils/util';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		playList: [], // 演奏方式
		playName: '', // 演奏方式
		playId: '', // 演奏方式
		instrumentList: [], // 选择乐器的list
		instrumentSelectName: '',
		instrumentSelectId: '',
		title: '', // 需求名称
		typeList: [], // 演奏类型
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		// 获取所有演奏方式
		this.getAllPlayList();
		// 获取所有乐器类型
		await this.getAllInstruments(instruments);
		this.initMsg();
	},

	initMsg: function () {
		const publish = getStoragePublishMsg('publish1');
		if (publish && publish.title) {
			const tempList = Number(publish.playId) === 1 ? instruments : voices;
			const instrumentSelectItem = tempList.filter((item) => item.id === publish.instrumentSelectId)[0];
			const playSelectItem = plays.filter((item) => item.id === publish.playId)[0];
			this.setData({
				title: publish.title,
				instrumentSelectId: instrumentSelectItem.id,
				instrumentSelectName: instrumentSelectItem.name,
				playName: playSelectItem.name,
				playId: playSelectItem.id,
			});
		}
	},

	// 获取所有演奏类型
	getAllPlayList: function () {
		const playList = [];
		plays.forEach((item) => playList.push(item.name));
		this.setData({ playList: playList || [] });
	},

	// 选择演奏类型
	onSelectPlay: function (e) {
		const { value } = e.detail;
		const { name, id } = plays[value];
		this.setData({ playName: name, playId: id, instrumentSelectName: '', instrumentSelectId: '' });
		// 获取所有乐器类型
		this.getAllInstruments(Number(value) === 1 ? voices : instruments);
		setStoragePublishMsg('publish1', { playId: id, instrumentSelectId: '' });
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
