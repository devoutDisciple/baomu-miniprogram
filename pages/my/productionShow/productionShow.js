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
		type: 1, // 1-作品 2-动态
		showBtn: false, // 展示添加按钮
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { user_id, type } = options;
		const owner_id = wx.getStorageSync('user_id');
		console.log(user_id, owner_id);
		const showBtn = Number(user_id) === Number(owner_id);
		this.setData({ user_id, type, owner_id, showBtn }, () => {
			if (Number(type) === 1) {
				wx.setNavigationBarTitle({
					title: '作品展示',
				});
			} else {
				wx.setNavigationBarTitle({
					title: '全部动态',
				});
			}
			this.getProduction();
		});
	},

	// 获取作品
	getProduction: async function () {
		loading.showLoading();
		const { user_id, type } = this.data;
		const result = await request.get({ url: '/production/allByUserId', data: { user_id, type } });
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
