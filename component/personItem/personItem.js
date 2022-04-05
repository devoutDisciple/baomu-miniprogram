// component/personItem/personItem.js
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
		onTapPerson: function () {
			wx.navigateTo({
				url: `/pages/personDetail/personDetail?user_id=${this.data.data.id}`,
			});
		},
		onTapInvitation: function () {
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			// 乐队邀请页面
			if (currentPage.route === 'pages/team/invitation/invitation') {
				return this.triggerEvent('OnTapInvitation', { user_id: this.data.data.id });
			}
			wx.navigateTo({
				url: '/pages/invitation/invitation',
			});
		},
	},
});
