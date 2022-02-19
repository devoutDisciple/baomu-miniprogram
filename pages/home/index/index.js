// pages/home/index/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		selectTabIdx: 2, // 1-找演出 2-去演出
		personList: [1, 2, 3, 4, 5, 6, 7, 8],
		taskList: [1, 2, 3, 4, 5, 6, 7, 8],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
	},

	// 选择去演出或者找演出
	onSelectTab: function (e) {
		console.log(e, 111);
		const { idx } = e.currentTarget.dataset;
		this.setData({ selectTabIdx: Number(idx) });
	},

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
