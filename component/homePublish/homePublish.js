// eslint-disable-next-line import/named
import { getStoragePublishMsg } from '../../utils/util';
import request from '../../utils/request';
import loading from '../../utils/loading';
import config from '../../config/config';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		process: {
			type: Number,
			value: 1,
		},
		bgUrl: {
			type: String,
			value: config.defaultPublishUrl,
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
		onTapNext: async function (e) {
			const { idx } = e.currentTarget.dataset;
			const publish1 = getStoragePublishMsg('publish1');
			const publish2 = getStoragePublishMsg('publish2');
			const publish3 = getStoragePublishMsg('publish3');
			if (idx === 1) {
				if (!publish1 || !publish1.title || !publish1.instrumentSelectId || !publish1.playId) {
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
				if (
					!publish2 ||
					!publish2.startTime ||
					!publish2.endTime ||
					!publish2.hours ||
					!publish2.bargain ||
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
				if (!publish3 || !publish3.foods || !publish3.desc || !publish3.price || !publish3.send) {
					return wx.showToast({
						title: '请完善信息',
						icon: 'error',
					});
				}
				const user_id = wx.getStorageSync('user_id');
				if (!user_id) {
					return wx.showToast({
						title: '发布失败',
						icon: 'error',
					});
				}
				loading.showLoading();
				// 所有校验通过后，上传需求详情
				const params = {
					user_id: user_id,
					title: publish1.title,
					play_id: publish1.playId,
					instrument_id: publish1.instrumentSelectId,
					start_time: publish2.startTime,
					end_time: publish2.endTime,
					is_bargain: publish2.bargain === '是' ? 1 : 2,
					hours: publish2.hours,
					addressAll: publish2.selectAddress.address,
					addressName: publish2.selectAddress.name,
					latitude: publish2.selectAddress.latitude,
					longitude: publish2.selectAddress.longitude,
					desc: publish3.desc,
					is_food: publish3.foods === '是' ? 1 : 2,
					is_send: publish3.send === '是' ? 1 : 2,
					price: publish3.price,
					state: 1, // 需求开启竞价
				};
				const res = await request.post({ url: '/demand/addDemand', data: params });
				if (res === 'success') {
					loading.hideLoading();
					this.setData({
						dialogDetail: {
							title: '发布成功!',
							src: '/asserts/public/publish.png',
							desc: '需求已展示在需求大厅中，请耐心等待！',
						},
						dialogVisible: true,
					});
				}
			}
		},
		onCloseDialog: function () {
			this.setData({ dialogVisible: false });
			wx.switchTab({
				url: '/pages/home/index/index',
			});
		},
	},

	observes: {
		bgUrl: function (a) {
			console.log(a, 23);
		},
	},
});
