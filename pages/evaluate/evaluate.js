import request from '../../utils/request';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		user_id: '', // 被评价人的id
		demand_id: '', // 需求id
		value: '',
		desc: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { user_id, demand_id } = options;
		this.setData({ user_id: user_id, demand_id });
	},

	onChange: function (e) {
		const value = e.detail;
		this.setData({ value: value });
	},

	onBlurIpt: function (e) {
		const { value } = e.detail;
		this.setData({ desc: String(value).trim() });
	},

	onSend: function () {
		const self = this;
		setTimeout(async () => {
			const { user_id, demand_id, value, desc } = self.data;
			const publisher_id = wx.getStorageSync('user_id');
			console.log(user_id, demand_id, value, desc, publisher_id);
			if (!user_id || !demand_id || !publisher_id || !value) {
				return wx.showToast({
					title: '系统错误',
					icon: 'error',
				});
			}
			const result = await request.post({
				url: '/demandEvaluate/addEvaluate',
				data: { user_id, demand_id, publisher_id, grade: value, desc },
			});
			if (result === 'success') {
				wx.showToast({
					title: '评价成功',
					icon: 'success',
				});
				setTimeout(() => {
					wx.navigateBack();
				}, 1000);
			}
		}, 500);
	},
});
