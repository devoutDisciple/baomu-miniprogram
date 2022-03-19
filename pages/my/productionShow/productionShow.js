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
				const itemVideo = item.video;
				if (itemVideo && itemVideo.duration && itemVideo.url) {
					// width: 300rpx;
					// height: 246rpx;
					if (itemVideo.width > itemVideo.height) {
						itemVideo.videoHeight = parseInt((Number(itemVideo.height) * 300) / Number(itemVideo.width));
						itemVideo.videoWidth = 300;
					} else {
						itemVideo.videoWidth = parseInt((Number(itemVideo.width) * 246) / Number(itemVideo.height));
						itemVideo.videoHeight = 246;
					}
				}
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
