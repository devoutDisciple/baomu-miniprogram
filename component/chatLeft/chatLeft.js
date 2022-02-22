Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		msg: {
			type: Object,
			value: {},
		},
		userPhoto: {
			type: String,
			value: '',
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	lifetimes: {
		attached: function () {
			console.log(this.data.msg, 11);
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {},
});
