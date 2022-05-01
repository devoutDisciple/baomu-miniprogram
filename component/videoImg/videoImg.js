Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		videoDetail: {
			type: Object,
			value: {},
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		videoDetail: {},
		width: 100,
		height: 100,
		src: '',
	},

	lifetimes: {
		attached: function () {},
	},

	observers: {
		videoDetail: function (videoDetail) {
			const { photo } = videoDetail;
			if (photo && photo.width) {
				this.setData({ width: photo.width, height: photo.height, src: photo.url });
			}
			this.setData({ video: videoDetail });
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onPreviewImg: function () {
			const { video } = this.data;

			wx.previewMedia({
				sources: [
					{
						url: video.url,
						type: 'video',
						poster: video.photo.url,
					},
				],
			});
		},
	},
});
