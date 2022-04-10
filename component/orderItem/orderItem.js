import request from '../../utils/request';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		data: {
			type: Object,
			value: {},
		},
		type: {
			type: Number,
			// 1-需求方 2-演员
			value: 1,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击进入详情
		onTapDemandDetail: function () {
			const { data, type } = this.data;
			if (type === 1) {
				// 我发布的
				wx.navigateTo({
					url: `/pages/my/orderDetailForPublisher/orderDetailForPublisher?id=${data.id}`,
				});
			} else {
				// 我参与的
				wx.navigateTo({
					url: `/pages/my/orderDetailForActor/orderDetailForActor?id=${data.id}`,
				});
			}
		},

		// 点击支付, 同意报价，但是未支付
		onTapPay: async function () {
			const open_id = wx.getStorageSync('open_id');
			const user_id = wx.getStorageSync('user_id');
			const { id } = this.data.data;
			// pay_type: 1-付款 2-退款 3-其他
			const result = await request.post({
				url: '/pay/payByShoper',
				data: { open_id, user_id, demand_id: id },
			});
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

		// 点击完成，支付给用户
		onTapSuccess: async function () {
			wx.showToast({
				title: '已付款给用户',
			});
		},
	},
});
