import util from '../../utils/util';

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
		detail: {},
	},

	observers: {
		data: async function (data) {
			const { height, width } = data.video;
			const { newHeight, newWidth } = await util.getVideoSize({ height, width });
			data.video = { ...data.video, videoWidth: newWidth, videoHeight: newHeight };
			this.setData({ detail: data });
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onSeachDetail: function () {
			const { id } = this.data.data;
			wx.navigateTo({
				url: `/pages/my/productionDetail/productionDetail?id=${id}&type=${this.data.data.type}`,
			});
		},
	},
});
