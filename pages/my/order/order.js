/* eslint-disable prefer-destructuring */
import request from '../../../utils/request';
import {
	PLAYS_STYLE,
	instruments,
	voices,
	DEMAND_STATE,
	price_state,
	DEMAND_STATE_FOR_ACTOR,
} from '../../../constant/constant';
import config from '../../../config/config';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		is_first: true,
		orderList: [],
		selectTabIdx: 1,
		evaluateVisible: false, // 评价弹框
		evaluateDetail: {}, // 评价详情
	},

	onShow: function () {
		this.onSearchOrder();
	},

	// 选择去演出或者找演出
	onSelectTab: function (e) {
		let { idx } = e.currentTarget.dataset;
		idx = Number(idx);
		this.setData({ selectTabIdx: Number(idx), currentUserPage: 0 }, () => {
			this.onSearchOrder();
		});
	},

	// 查询回调
	onSearchForItem: function () {
		this.onSearchOrder();
	},

	// 查询我参与的需求
	onSearchOrder: async function () {
		try {
			loading.showLoading();
			const { selectTabIdx } = this.data;
			const user_id = wx.getStorageSync('user_id');
			// type 1-发布的 2-参与的
			const orders = await request.get({ url: '/demand/demandByUserId', data: { user_id, type: selectTabIdx } });
			if (Array.isArray(orders)) {
				orders.forEach((item) => {
					// 获取演奏类型
					const { name: playName } = PLAYS_STYLE.filter((p) => p.id === Number(item.play_id))[0];
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
					if (this.data.selectTabIdx === 2) {
						// 如果是演员查看需求状态
						if (item.priceState !== 4) {
							item.detailStateName = price_state.filter((p) => p.id === item.state)[0].name;
						} else {
							item.detailStateName = DEMAND_STATE_FOR_ACTOR.filter((p) => p.id === item.state)[0].name;
						}
					} else {
						// 需求方看到的状态
						item.detailStateName = DEMAND_STATE.filter((p) => p.id === item.state)[0].name;
					}
				});
			}
			this.setData({ orderList: orders, is_first: false });
		} finally {
			loading.hideLoading();
		}
	},

	// 关闭评价弹框
	onCloseEvaluateDialog: function () {
		this.setData({ evaluateVisible: false });
	},

	// 点击查看评论详情
	onTapEvaluate: async function (e) {
		try {
			this.setData({ evaluateDetail: {} }, async () => {
				const { data } = e.detail;
				const result = await request.get({
					url: '/demandEvaluate/evaluateDetail',
					data: { demand_id: data.id },
				});
				this.setData({ evaluateDetail: result, evaluateVisible: true });
			});
		} catch (error) {
			this.setData({ evaluateDetail: {}, evaluateVisible: false });
		}
	},
});
