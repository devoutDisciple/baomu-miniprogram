// pages/test/test.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		calendar: [],
		week: ['日', '一', '二', '三', '四', '五', '六'],
		// week: ['Sun', 'Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat'],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		const selectRange = [
			{
				start_time: 3,
				end_time: 10,
			},
			{
				start_time: 16,
				end_time: 17,
			},
		];
		const arr = [];
		for (let index = 1; index < 31; index++) {
			arr.push({
				day: index,
				is_start: false,
				is_end: false,
				is_ranger: false,
			});
		}
		selectRange.forEach((range) => {
			arr.forEach((item) => {
				if (item.day === range.start_time) {
					item.is_start = true;
				}
				if (item.day === range.end_time) {
					item.is_end = true;
				}
				if (item.day > range.start_time && item.day < range.end_time) {
					item.is_ranger = true;
				}
			});
		});
		this.setData({ calendar: arr });
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
