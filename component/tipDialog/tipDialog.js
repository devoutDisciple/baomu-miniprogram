// component/tipDialog/tipDialog.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 图片
		src: {
			type: String,
			value: '',
		},
		title: {
			type: String,
			value: '',
		},
		desc: {
			type: String,
			value: '',
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
		onCloseDialog: function () {
			this.triggerEvent('OnClose');
		},
	},
});
