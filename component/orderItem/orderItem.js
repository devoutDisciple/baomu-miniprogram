// component/orderItem/orderItem.js
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
	},
});
