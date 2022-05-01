import deviceUtil from '../../utils/deviceUtil';

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
	data: {
		screenWidth: 0,
		detail: {},
	},

	observers: {
		data: async function (data) {
			let { screenWidth } = this.data;
			if (!screenWidth) {
				screenWidth = await this.getScreenWidth();
			}
			console.log(screenWidth, 1111);
			const { height, width } = data.video;
			if (Number(height) > Number(width)) {
				let newWidth = screenWidth;
				newWidth = Number((screenWidth * 3) / 5).toFixed(0);
				data.video.videoWidth = newWidth;
				data.video.videoHeight = newWidth * 1.3 < height ? newWidth * 1.3 : height;
			}
			console.log(data, 2222);
			this.setData({ detail: data });
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		getScreenWidth: async function () {
			const { screenWidth } = await deviceUtil.getDeviceInfo();
			this.setData({ screenWidth: screenWidth });
			return screenWidth || 390;
		},
		onSeachDetail: function () {
			const { id } = this.data.data;
			wx.navigateTo({
				url: `/pages/my/productionDetail/productionDetail?id=${id}&type=${this.data.data.type}`,
			});
		},
	},
});
