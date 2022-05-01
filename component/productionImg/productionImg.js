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
		onPreviewImg: function (e) {
			const { src } = e.currentTarget.dataset;
			wx.previewImage({ urls: [src] });
		},
	},

	// observers: {
	// 	data: function (e) {
	// 		if (e.type === 'video') {
	// 			e.videoId = e.url;
	// 			this.setData({
	// 				detail: e,
	// 			});
	// 		}
	// 	},
	// },
});
