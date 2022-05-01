import request from '../../../utils/request';
import loading from '../../../utils/loading';
import login from '../../../utils/login';
import { instruments } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
	},

	onLoad: function () {
		this.getAllProductions();
	},

	// 获取发布的列表
	getAllProductions: async function () {
		loading.showLoading();
		if (!login.isLogin()) {
			await login.getLogin();
		}
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/production/allProductions', data: { user_id } });
		if (result && result.length !== 0) {
			result.forEach((item) => {
				item.instr_name = instruments.filter((ins) => ins.id === item.instr_id)[0].name;
			});
		}
		this.setData({ list: result });
		loading.hideLoading();
	},

	// 点击发布
	onTapPublish: function () {
		const user_id = wx.getStorageSync('user_id');
		wx.navigateTo({
			url: `/pages/my/productionPublish/productionPublish?user_id=${user_id}&type=2`,
		});
	},
});
