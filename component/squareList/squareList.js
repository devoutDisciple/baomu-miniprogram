// component/squareList/squareList.js
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
		onSeachDetail: function () {
			const { id } = this.data.data;
			console.log(this.data.data, 7238);
			wx.navigateTo({
				url: `/pages/my/productionDetail/productionDetail?id=${id}&type=${this.data.data.type}`,
			});
		},
	},
});
