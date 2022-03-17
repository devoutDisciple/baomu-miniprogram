Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		src: {
			type: String,
			value: '',
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		width: 200,
		height: 100,
	},

	lifetimes: {
		attached: function () {},
	},

	observers: {
		src: function (src) {
			const self = this;
			wx.getImageInfo({
				src: src,
				success: function (res) {
					const { width, height } = res;
					self.setData({ width, height });
				},
				fail: function (err) {
					console.log(err);
				},
			});
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onPreviewImg: function (e) {
			const { src } = e.currentTarget.dataset;
			wx.previewImage({ urls: [src] });
		},
	},
});
