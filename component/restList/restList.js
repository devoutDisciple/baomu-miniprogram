// component/restList/restList.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		data: {
			type: Object,
			value: {},
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
		onSearchDetail: function () {
			const { data } = this.data;
			wx.navigateTo({
				url: `/pages/rest/detail/detail?id=${data.id}`,
			});
		},
	},
});
