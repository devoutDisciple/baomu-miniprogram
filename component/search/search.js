// component/search/search.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onConfirm: function (e) {
			let { value } = e.detail;
			value = String(value).trim();
			this.triggerEvent('OnSearch', { value });
		},
	},
});
