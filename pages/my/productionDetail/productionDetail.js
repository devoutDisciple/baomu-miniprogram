import request from '../../../utils/request';
import { instruments } from '../../../constant/constant';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '', // 作品id
		detail: {}, // 作品详情
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { id } = options;
		if (!id) {
			return wx.switchTab({
				url: '/pages/home/index/index',
			});
		}
		this.setData({ id }, () => {
			this.onSearchProductionDetail();
		});
	},

	// 查询作品详情
	onSearchProductionDetail: async function () {
		try {
			loading.showLoading();
			const { id } = this.data;
			const detail = await request.get({ url: '/production/detailById', data: { id } });
			if (detail) {
				detail.instr_name = instruments.filter((ins) => ins.id === detail.instr_id)[0].name;
			}
			this.setData({ detail });
			loading.hideLoading();
		} catch (error) {
			console.log(error);
			loading.hideLoading();
		}
	},
});
