// component/tipDialog/tipDialog.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		checked: false,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onTapCheckChange: function () {
			const value = !this.data.checked;
			this.setData({ checked: value });
			this.triggerEvent('OnCheckChange', { value: value });
		},

		goPrivacy: function (e) {
			const { key } = e.currentTarget.dataset;
			if (Number(key) === 1) {
				wx.navigateTo({
					url: '/pages/my/serviceAgreement/serviceAgreement',
				});
			}
			if (Number(key) === 2) {
				wx.navigateTo({
					url: '/pages/my/privacy/privacy',
				});
			}
		},
	},
});
