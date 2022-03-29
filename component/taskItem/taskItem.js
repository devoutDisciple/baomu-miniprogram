// component/taskItem/taskItem.js
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
		onTapTask: function () {
			wx.navigateTo({
				url: `/pages/publishDetail/publishDetail?id=${this.data.data.id}`,
			});
		},
		onTapPerson: function () {
			wx.navigateTo({
				url: `/pages/personDetail/personDetail?user_id=${this.data.data.user_id}`,
			});
		},
	},

	observers: {
		data: function () {},
	},
});
