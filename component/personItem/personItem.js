// component/personItem/personItem.js
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
		onTapPerson: function () {
			wx.navigateTo({
				url: '/pages/personDetail/personDetail',
			});
		},
		onTapInvitation: function () {
			wx.navigateTo({
				url: '/pages/invitation/invitation',
			});
		},
	},
});
