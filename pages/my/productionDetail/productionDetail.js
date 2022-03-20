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
		hadGoods: false, // 是否给该作品点过赞
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
			this.onSearchCommonts(id);
			this.getUserProductionGoods(id);
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

	// 查询评论
	onSearchCommonts: function (id) {
		const user_id = wx.getStorageSync('user_id');
		loading.showLoading();
		request
			.get({ url: '/reply/allByContentId', data: { content_id: id, user_id, current: 1 } })
			.then((res) => {
				this.setData({ comments: res || [] });
			})
			.finally(() => loading.hideLoading());
	},

	// 查看是否点过赞
	getUserProductionGoods: async function (id) {
		const user_id = wx.getStorageSync('user_id');
		const hadGoods = await request.get({ url: '/goods/userProductionGoods', data: { user_id, content_id: id } });
		this.setData({ hadGoods: hadGoods === 1 });
	},
});
