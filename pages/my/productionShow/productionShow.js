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
		// 如果是团队页面跳转过来的，团队成员需要展示发布按钮
		const { user_id, type, showPublishBtn } = options;
		const owner_id = wx.getStorageSync('user_id');
		let showBtn = Number(user_id) === Number(owner_id);
		if (showPublishBtn === 'true') {
			showBtn = true;
		}
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
		const { user_id, type } = this.data;
		wx.navigateTo({
			url: `/pages/my/productionPublish/productionPublish?user_id=${user_id}&type=${type}`,
		});
	},

	// 点击详情
	onShowDetail: function (e) {
		const { id } = e.currentTarget.dataset;
		const { type } = this.data;
		wx.navigateTo({
			url: `/pages/my/productionDetail/productionDetail?id=${id}&type=${type}`,
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
							self.getProduction();
						}, 500);
					}
				}
			},
		});
	},
});
