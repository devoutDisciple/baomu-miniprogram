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

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow: function () {
		this.getAllProductions();
	},

	// 获取发布的列表
	getAllProductions: async function () {
		loading.showLoading();
		if (!login.isLogin()) {
			await login.getLogin();
		}
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/production/allProductionsByUserid', data: { user_id } });
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

	// 删除作品
	onDeleteItem: function (e) {
		const { id } = e.currentTarget.dataset.item;
		const self = this;
		wx.showModal({
			title: '删除',
			content: '是否确认删除该作品',
			success: async function (res) {
				if (res.errMsg === 'showModal:ok' && res.confirm) {
					loading.showLoading();
					const result = await request.post({ url: '/production/deleteItemById', data: { id: id } });
					if (result === 'success') {
						loading.hideLoading();
						wx.showToast({
							title: '删除成功',
						});
						setTimeout(() => {
							self.getAllProductions();
						}, 500);
					}
				}
			},
		});
	},
});
