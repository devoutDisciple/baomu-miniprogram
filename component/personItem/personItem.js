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
			const { data } = this.data;
			const { type } = data;
			// 如果是个人
			if (type === 1) {
				wx.navigateTo({
					url: `/pages/personDetail/personDetail?user_id=${data.id}`,
				});
			} else {
				wx.navigateTo({
					url: `/pages/team/detail/detail?user_id=${data.id}`,
				});
			}
		},
		onTapInvitation: function () {
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			const { id } = this.data.data;
			// 乐队邀请页面
			if (currentPage.route === 'pages/team/invitation/invitation') {
				return this.triggerEvent('OnTapInvitation', { user_id: this.data.data.id });
			}
			wx.navigateTo({
				url: `/pages/invitation/invitation?person_id=${id}`,
			});
		},
	},
});
