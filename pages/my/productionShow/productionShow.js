import request from '../../../utils/request';
import loading from '../../../utils/loading';
import { instruments } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		owner_id: '',
		user_id: '',
		productionList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const user_id = options;
		const owner_id = wx.getStorageSync('user_id');
		this.setData({ user_id, owner_id }, () => {
			this.getProduction();
		});
	},

	// 获取作品
	getProduction: async function () {
		loading.showLoading();
		const { user_id } = this.data;
		const result = await request.get({ url: '/production/allByUserId', data: user_id });
		if (result && result.length !== 0) {
			result.forEach((item) => {
				item.instr_name = instruments.filter((ins) => ins.id === item.instr_id)[0].name;
			});
		}
		this.setData({ productionList: result });
		loading.hideLoading();
	},

	// 点击添加作品
	onTapAdd: function () {
		wx.navigateTo({
			url: '/pages/my/productionPublish/productionPublish',
		});
	},

	// 点击详情
	onShowDetail: function (e) {
		const { id } = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/my/productionDetail/productionDetail?id=${id}`,
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (this.data.user_id && this.data.owner_id) {
			this.getProduction();
		}
	},
});
