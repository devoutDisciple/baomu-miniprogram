import deviceUtil from '../../../utils/deviceUtil';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: '80px', // 总高度
		statusBarHeight: '40px', // 上方状态栏高度
		showLoading: false, // 加载图标
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getDeviceData();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.setData({ showLoading: true });
		setTimeout(() => {
			wx.stopPullDownRefresh({
				success: () => {
					this.setData({ showLoading: false });
				},
			});
		}, 500);
	},

	jumpPage: function (url) {
		wx.navigateTo({
			url: url,
		});
	},

	// 前往其他页面
	goOtherPage: function (e) {
		const { type } = e.currentTarget.dataset;
		console.log(type, 1111);
		// 我的发布
		if (type === 'publish') this.jumpPage('/pages/my/myPublish/myPublish');
		// 我的乐队
		if (type === 'team') this.jumpPage('/pages/my/myPublish/myPublish');
		// 我的评论
		if (type === 'comment') this.jumpPage('/pages/my/myPublish/myPublish');
		// 工作记录
		if (type === 'order') this.jumpPage('/pages/my/order/order');
		// 获奖认证
		if (type === 'honor') this.jumpPage('/pages/my/school/school');
		// 实名认证
		if (type === 'shenfen') this.jumpPage('/pages/my/idcard/idcard');
		// 考级认证
		if (type === 'level') this.jumpPage('/pages/my/level/level');
		// 消息中心
		if (type === 'message') this.jumpPage('/pages/message/message');
		// 我的技能
		if (type === 'skill') this.jumpPage('/pages/my/skill/skill');
		// 照片墙
		if (type === 'photo') this.jumpPage('/pages/my/myPublish/myPublish');
		// 工作地点
		if (type === 'address') this.jumpPage('/pages/my/myPublish/myPublish');
		// 可预约时段
		if (type === 'time') this.jumpPage('/pages/my/myPublish/myPublish');
		// 作品展示
		if (type === 'productionShow') this.jumpPage('/pages/my/productionShow/productionShow');
		// 去组团
		if (type === 'getTeam') this.jumpPage('/pages/my/myPublish/myPublish');
		// 客服中心
		if (type === 'service') this.jumpPage('/pages/my/myPublish/myPublish');
	},

	// 获取设备信息
	getDeviceData: function () {
		// 获取设备信息
		deviceUtil.getDeviceInfo().then((res) => {
			const { navHeight, statusBarHeight } = res;
			this.setData({
				statusBarHeight: `${statusBarHeight}px`,
				statusHeight: `${navHeight + statusBarHeight}px`,
			});
		});
	},
});
