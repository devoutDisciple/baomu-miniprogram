import request from '../../../utils/request';
import { instruments } from '../../../constant/constant';
import loading from '../../../utils/loading';
import util from '../../../utils/util';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '', // 作品id
		type: 1, // 1-作品 2-动态
		detail: {}, // 作品详情
		hadGoods: false, // 是否给该作品点过赞
		comment_total: 0, // 全部评价
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { id, type } = options;
		if (!id) {
			return wx.switchTab({
				url: '/pages/home/index/index',
			});
		}
		if (Number(type) === 1) {
			wx.setNavigationBarTitle({
				title: '作品详情',
			});
		} else {
			wx.setNavigationBarTitle({
				title: '动态详情',
			});
		}
		this.setData({ id, type }, () => {
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
			if (detail && detail.instr_id) {
				detail.instr_name = instruments.filter((ins) => ins.id === detail.instr_id)[0].name;
			}
			if (detail.video) {
				const { screenWidth } = await util.getVideoSize({
					height: detail.video.height,
					width: detail.video.width,
				});
				const newWidth = screenWidth - 20;
				const newHeight = (newWidth / detail.video.width) * detail.video.height;
				detail.video.videoWidth = newWidth;
				detail.video.videoHeight = newHeight;
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
				this.setData({ comments: res.list || [], comment_total: res.count });
			})
			.finally(() => loading.hideLoading());
	},

	// 查看是否点过赞
	getUserProductionGoods: async function (id) {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const hadGoods = await request.get({ url: '/goods/userProductionGoods', data: { user_id, content_id: id } });
		this.setData({ hadGoods: hadGoods === 1 });
		loading.hideLoading();
	},

	// 评论成功之后
	onRepluSuccess: function () {
		this.onSearchCommonts(this.data.id);
	},

	// 查看用户详情
	onTapUserDetail: function () {
		const { id: user_id, type } = this.data.detail.userDetail;
		// 这是个人
		if (Number(type) === 1) {
			wx.navigateTo({
				url: `/pages/personDetail/personDetail?user_id=${user_id}`,
			});
		}
		// 这是团队
		if (Number(type) === 2) {
			wx.navigateTo({
				url: `/pages/team/detail/detail?user_id=${user_id}`,
			});
		}
	},
});
