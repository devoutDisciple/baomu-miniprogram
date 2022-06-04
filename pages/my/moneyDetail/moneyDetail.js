import loading from '../../../utils/loading';
import request from '../../../utils/request';
import { MONEY_TYPE } from '../../../constant/constant';

// pages/order/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		payList: [],
		refresherTriggered: false,
		keywords: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getPayRecord();
	},

	// 获取账户明细
	getPayRecord: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/money/allRecord', data: { user_id: user_id } });
		console.log(result, 3288);
		if (Array.isArray(result)) {
			result.forEach((item) => {
				item.typeName = MONEY_TYPE.filter((pay) => Number(item.type) === pay.id)[0].name;
			});
		}
		this.setData({ payList: result });
		loading.hideLoading();
	},

	// 刷新
	onRefresh: async function () {
		this.setData({ refresherTriggered: true });
		await this.getPayRecord();
		this.setData({ refresherTriggered: false });
	},
});
