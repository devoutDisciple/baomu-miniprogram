import request from '../../utils/request';
import loading from '../../utils/loading';

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
			const { data } = this.data;
			const self = this;
			wx.showModal({
				title: '是否确认演出完成',
				content: '点击完成后系统会在1-3个工作日内将演出费用支付给演员，请谨慎操作',
				success: async function (e) {
					const { confirm, errMsg } = e;
					if (errMsg === 'showModal:ok' && confirm) {
						const result = await request.post({
							url: '/demand/complete',
							data: { id: data.id },
						});
						if (result === 'success') {
							wx.showModal({
								title: '已确认演出完成',
								showCancel: false,
							});
							self.triggerEvent('OnSearchForItem');
						}
					}
				},
			});
		},

		// 点击评价
		onTapEvaluate: function () {
			const { data } = this.data;
			if (!data.final_user_id) {
				return wx.showToast({
					title: '系统错误',
					icon: 'error',
				});
			}
			wx.navigateTo({
				url: `/pages/evaluate/evaluate?user_id=${data.final_user_id}&demand_id=${data.id}`,
			});
		},

		// 点击查看评价详情
		onSearchEvaluate: function () {
			const { data } = this.data;
			this.triggerEvent('OnTapEvaluate', { data: data });
		},

		// 点击取消订单
		onTapCancle: function () {
			const { data } = this.data;
			const self = this;
			wx.showModal({
				title: '取消需求',
				content: '是否确认取消该需求，该操作不可逆，请谨慎操作',
				success: async function (e) {
					const { confirm, errMsg } = e;
					if (errMsg === 'showModal:ok' && confirm) {
						loading.showLoading();
						await request.post({ url: '/demand/cancle', data: { id: data.id } });
						loading.hideLoading();
						wx.showToast({
							title: '取消成功',
						});
						self.triggerEvent('OnSearchForItem');
					}
				},
			});
		},

		// 点击发布人头像
		onTapPublisherDetail: function () {
			const { data } = this.data;
			wx.navigateTo({
				url: `/pages/personDetail/personDetail?user_id=${data.user_id}`,
			});
		},
	},
});
