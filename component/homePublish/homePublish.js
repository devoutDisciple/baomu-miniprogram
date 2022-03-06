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
	data: {},

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
				if (!publish1.title || !publish1.instrumentSelectId) {
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
				wx.navigateTo({
					url: '/pages/home/publish3/publish3',
				});
			}
		},
	},
});
