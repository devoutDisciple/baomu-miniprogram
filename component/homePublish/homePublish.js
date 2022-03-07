// eslint-disable-next-line import/named
import { getStoragePublishMsg, setStoragePublishMsg } from '../../utils/util';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		process: {
			type: Number,
			value: 1,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		dialogDetail: {},
		dialogVisible: false,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onTapPre: function () {
			wx.navigateBack();
		},
		onTapNext: function (e) {
			const { idx } = e.currentTarget.dataset;
			if (idx === 1) {
				const publish1 = getStoragePublishMsg('publish1');
				if (!publish1 || !publish1.title || !publish1.instrumentSelectId) {
					return wx.showToast({
						title: '请完善信息',
						icon: 'error',
					});
				}
				wx.navigateTo({
					url: '/pages/home/publish2/publish2',
				});
			}
			if (idx === 2) {
				const publish2 = getStoragePublishMsg('publish2');
				if (
					!publish2 ||
					!publish2.startTime ||
					!publish2.endTime ||
					!publish2.hours ||
					!publish2.price ||
					!publish2.selectAddress
				) {
					return wx.showToast({
						title: '请完善信息',
						icon: 'error',
					});
				}
				wx.navigateTo({
					url: '/pages/home/publish3/publish3',
				});
			}
			if (idx === 3) {
				const publish3 = getStoragePublishMsg('publish3');
				if (!publish3 || !publish3.foods || !publish3.desc || !publish3.price || !publish3.send) {
					return wx.showToast({
						title: '请完善信息',
						icon: 'error',
					});
				}
				this.setData({
					dialogDetail: {
						title: '发布成功!',
						src: '/asserts/public/publish.png',
						desc: '需求已展示在需求大厅中，请耐心等待！',
					},
					dialogVisible: true,
				});
			}
		},
		onCloseDialog: function () {
			this.setData({ dialogVisible: false });
		},
	},
});
