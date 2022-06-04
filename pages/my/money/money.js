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
		sumMoney: '0.00', // 总金额
		freezeMoney: '0.00', // 冻结金额
		availableMoney: '0.00', // 可用金额
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
		const result = await request.get({ url: '/money/allMoney', data: { user_id: user_id } });
		this.setData({
			sumMoney: result.sumMoney,
			freezeMoney: result.freezeMoney,
			availableMoney: result.availableMoney,
		});
		loading.hideLoading();
	},

	// 点击提现
	onTapMoney: async function () {
		const { money } = this.data;
		const self = this;
		wx.showModal({
			title: '请输入提现金额',
			editable: true,
			placeholderText: '请输入提现金额',
			success: async (res) => {
				if (res.confirm && res.errMsg === 'showModal:ok') {
					const value = Number(res.content);
					if (!value > 0) {
						return wx.showModal({
							title: '请输入金额有误',
							showCancel: false,
						});
					}
					if (value > Number(money)) {
						return wx.showModal({
							title: '可提现金额不足',
							showCancel: false,
						});
					}
					const user_id = wx.getStorageSync('user_id');
					await request.post({ url: '/money/withdraw', data: { user_id: user_id, total_money: value } });
					wx.showModal({
						title: '已发起提现',
						content: '提现金额将会在1-3个工作日内支付到您的微信账户，请耐心等待',
						showCancel: false,
						success: async () => {
							if (res.confirm && res.errMsg === 'showModal:ok') {
								self.getUserMoney();
							}
						},
					});
				}
			},
		});
	},

	// 点击详情
	onSearchDetail: function () {
		wx.navigateTo({
			url: '/pages/my/moneyDetail/moneyDetail',
		});
	},
});
