// component/commentItem/commentItem.js
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
	data: {
		detail: {},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {},

	observers: {
		data: function (data) {
			if (data && data.grade) {
				data.grade = Number(data.grade).toFixed(1);
				this.setData({ detail: data });
			}
		},
	},
});
