import request from '../../utils/request';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {},

	onTapPay: async function () {
		console.log(2222);
		const open_id = wx.getStorageSync('open_id');
		const result = await request.post({ url: '/baomupay/pay', data: { openid: open_id } });
		console.log(result);
		const { appId, paySign, packageSign, nonceStr, timeStamp } = result;
		if (!paySign || !packageSign)
			return wx.showToast({
				title: '系统错误',
				icon: 'error',
			});
		const params = {
			appId,
			timeStamp,
			nonceStr,
			paySign,
			signType: 'RSA',
			package: packageSign,
		};
		wx.requestPayment({
			...params,
			success(res) {
				if (res.errMsg === 'requestPayment:ok') {
					wx.showToast({
						title: '支付成功',
					});
				} else {
					wx.showToast({
						title: '请刷新后查看',
					});
				}
			},
			fail() {},
		});
	},
});
