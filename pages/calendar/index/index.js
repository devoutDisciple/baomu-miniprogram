import request from '../../../utils/request';
import moment from '../../../utils/moment';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		demands: [], // 需求
		selectTimeRange: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		const year = moment(new Date()).format('YYYY');
		const month = moment(new Date()).format('MM');
		this.onSearchDemand(year, month);
	},

	// 查看参与的需求
	onSearchDemand: async function (year, month) {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/demand/demandsByUserMonth', data: { user_id, year, month } });
		const selectTimeRange = [];
		if (Array.isArray(result) && result.length !== 0) {
			result.forEach((item) => {
				selectTimeRange.push({
					start_time: item.start_time,
					end_time: item.end_time,
					type: 2,
				});
			});
		}
		this.setData({ demands: result, selectTimeRange });
		loading.hideLoading();
	},

	// 更改月份
	onChangeMonth: function (e) {
		const { year, month } = e.detail;
		this.onSearchDemand(year, month);
	},
});
