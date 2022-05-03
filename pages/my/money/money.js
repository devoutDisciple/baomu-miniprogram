// pages/my/money/money.js
import { defaultMoneyUrl } from '../../../config/config';
import request from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		recordList: [1],
		defaultMoneyUrl: defaultMoneyUrl,
		money: '0.00',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad() {
		this.getUserMoney();
	},

	// 获取用户账户余额
	getUserMoney: async function () {
		// moneyByUserid
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/pay/moneyByUserid', data: { user_id: user_id } });
		console.log(result, 3288);
		this.setData({ money: result.data });
		loading.hideLoading();
	},

	// 点击详情
	onSearchDetail: function () {
		wx.navigateTo({
			url: '/pages/my/moneyDetail/moneyDetail',
		});
	},
});
