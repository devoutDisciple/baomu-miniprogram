/* eslint-disable prefer-destructuring */
import request from '../../../utils/request';
import { plays, instruments, voices, price_state } from '../../../constant/constant';
import config from '../../../config/config';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.onSearchOrder();
	},

	// 查询演出记录
	onSearchOrder: async function () {
		try {
			loading.showLoading();
			const user_id = wx.getStorageSync('user_id');
			const orders = await request.get({ url: '/demand/demandByUserId', data: { user_id } });
			console.log(orders, 1111);
			if (Array.isArray(orders)) {
				orders.forEach((item) => {
					// 获取演奏类型
					const { name: playName } = plays.filter((p) => p.id === Number(item.play_id))[0];
					let instrItem = {};
					// 获取乐器类型
					if (item.play_id === 1) {
						instrItem = instruments.filter((p) => p.id === Number(item.instrument_id))[0];
					} else {
						instrItem = voices.filter((p) => p.id === Number(item.instrument_id))[0];
					}
					// eslint-disable-next-line prefer-const
					let { name: instrumentName, url: instrumentUrl } = instrItem;
					instrumentUrl = config.baseUrl + instrumentUrl;
					item = Object.assign(item, { playName, instrumentName, instrumentUrl });
					console.log(price_state, 111);
					item.detailStateName = price_state.filter((p) => p.id === item.detailState)[0].name;
				});
			}
			this.setData({ orderList: orders });
		} finally {
			loading.hideLoading();
		}
	},
});
