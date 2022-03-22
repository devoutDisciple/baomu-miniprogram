import request from '../../../utils/request';
import loading from '../../../utils/loading';
import { instruments } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getAllProductions();
	},

	// 获取发布的列表
	getAllProductions: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/production/allProductions', data: { user_id } });
		if (result && result.length !== 0) {
			result.forEach((item) => {
				item.instr_name = instruments.filter((ins) => ins.id === item.instr_id)[0].name;
			});
		}
		loading.hideLoading();
		this.setData({ list: result });
	},

	// 点击发布
	onTapPublish: function () {
		wx.navigateTo({
			url: '/pages/my/productionPublish/productionPublish',
		});
	},
});
