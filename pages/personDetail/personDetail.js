// pages/personDetail/personDetail.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		dialogShow: false,
		dialogDetail: {
			title: '',
			src: '/asserts/public/renzhengbiaoshi.png',
			desc: '',
		},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},

	// 点击标识
	onTapSign: function (e) {
		console.log(e, 111);
		const { idx } = e.currentTarget.dataset;
		let dialogDetail = {};
		switch (idx) {
			case 1:
				dialogDetail = {
					title: '实名认证标识',
					src: '/asserts/public/renzhengbiaoshi.png',
					desc: '有此标识的用户通过平台审核身份真实有效',
				};
				break;
			case 2:
				dialogDetail = {
					title: '毕业院校认证标识',
					src: '/asserts/public/yuanxiaorenzheng.png',
					desc: '有此标识的用户通过平台审核身份真实有效',
				};
				break;
			case 3:
				dialogDetail = {
					title: '荣获奖项认证标识',
					src: '/asserts/public/huojiangrenzheng.png',
					desc: '此用户在xx届钢琴比赛中荣获1等级',
				};
				break;
			case 4:
				dialogDetail = {
					title: '专业考级认证标识',
					src: '/asserts/public/kaojirenzheng.png',
					desc: '此用户钢琴考级已过8级',
				};
				break;
			default:
				break;
		}
		this.setData({ dialogDetail, dialogShow: true });
	},

	// 点击关闭弹框
	onCloseDialog: function () {
		this.setData({ dialogShow: false });
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
