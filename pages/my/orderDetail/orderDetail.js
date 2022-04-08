/* eslint-disable prefer-destructuring */
import request from '../../../utils/request';
import loading from '../../../utils/loading';
import config from '../../../config/config';
import moment from '../../../utils/moment';
import login from '../../../utils/login';
import { plays, instruments, voices } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		detail: {}, // 发布详情
		priceDialogVisible: false, // 报价弹框
		price: 0, // 报价
		tipDialog: false, // 提示弹框
		selectTabIdx: 2, // 选择的tab的
		selectPersonIdx: 0, // 选择报名人的下标
		priceRecordList: [], // 议价记录
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { id } = options;
		this.setData({ id: id }, () => {
			// 获取发布详情
			this.getPublishDetail();
			// 获取议价记录
			this.getPriceRecordList();
		});
	},

	// 选择需求详情或者议价详情
	onSelectTab: function (e) {
		let { idx } = e.currentTarget.dataset;
		idx = Number(idx);
		this.setData({ selectTabIdx: Number(idx), currentUserPage: 0 });
	},

	// 获取发布详情
	getPublishDetail: async function () {
		loading.showLoading();
		const { id } = this.data;
		const user_id = wx.getStorageSync('user_id');
		if (!login.isLogin()) {
			await login.getLogin();
		}
		let detail = await request.get({ url: '/demand/detailById', data: { id, user_id } });
		// 获取演奏类型
		const { name: playName } = plays.filter((p) => p.id === Number(detail.play_id))[0];
		let instrItem = {};
		// 获取乐器类型
		if (detail.play_id === 1) {
			instrItem = instruments.filter((p) => p.id === Number(detail.instrument_id))[0];
		} else {
			instrItem = voices.filter((p) => p.id === Number(detail.instrument_id))[0];
		}
		// eslint-disable-next-line prefer-const
		let { name: instrumentName, url: instrumentUrl } = instrItem;
		instrumentUrl = config.baseUrl + instrumentUrl;
		detail = Object.assign(detail, { playName, instrumentName, instrumentUrl });
		const timeFormat = 'YYYY.MM.DD';
		detail.date = `${moment(detail.start_time).format(timeFormat)} - ${moment(detail.end_time).format(timeFormat)}`;
		detail.bargain = detail.is_bargain === 2 ? '不可议价' : '可议价';
		detail.food = detail.is_food === 2 ? '不包食宿' : '包食宿';
		detail.send = detail.is_send === 2 ? '不包接送' : '包接送';
		console.log(detail, 2839);
		// 个人竞标状态：detail.detailState: 1-未参与竞标 2-竞标进行中待商议 3-报名中 4-被拒绝  5-中标
		this.setData({ detail: detail });
		loading.hideLoading();
	},

	// 点击竞价
	onTapPrice: function () {
		this.setData({ priceDialogVisible: true });
	},

	// 输入框失焦
	onBlurIpt: function (e) {
		const { value } = e.detail;
		this.setData({ price: value });
	},

	// 取消报价
	onClose: function () {
		this.setData({ priceDialogVisible: false });
	},

	// 关闭提示弹框
	onCloseTipDialog: function () {
		this.setData({ tipDialog: false });
	},

	// 确认报价
	onConfirmPrice: function () {
		setTimeout(async () => {
			// eslint-disable-next-line prefer-const
			let { price, detail, priceRecordList, selectPersonIdx } = this.data;
			price = String(price).trim();
			if (!(Number(price) > 0)) {
				return wx.showToast({
					title: '报价输入有误',
					icon: 'error',
				});
			}
			loading.showLoading();
			// // 当前用户的id
			// const user_id = wx.getStorageSync('user_id');
			// // 是否是发布人
			// const is_publisher = Number(user_id) === Number(detail.user_id);
			// // if(is_publisher) {

			// // }
			const { id } = this.data;
			const result = await request.post({
				url: '/priceRecord/add',
				// type: 1-演员报价 2-需求方报价
				// state 1-未参与竞标 2-竞标进行中待商议 3-被拒绝  4-中标
				// operation: 第几次谈价
				data: {
					user_id: priceRecordList[selectPersonIdx].userDetail.id,
					publisher_id: detail.user_id,
					price,
					demand_id: id,
					type: 2,
					state: 2,
				},
			});
			if (result === 'success') {
				this.setData({ priceDialogVisible: false });
				await this.getPublishDetail();
				this.setData({ tipDialog: true });
				loading.hideLoading();
			}
			// this.setData({ priceDialogVisible: false });
		}, 500);
	},

	// 不可议价，直接报名，点击报名
	onTapSign: async function () {
		const user_id = wx.getStorageSync('user_id');
		const { id } = this.data;
		const result = await request.post({
			url: '/demand/signDemand',
			// type: 1-演员报价 2-需求方报价
			// state 1-未参与竞标 2-竞标进行中待商议 3-被拒绝  4-中标
			// operation: 第几次谈价
			data: { user_id, id: id },
		});
		if (result === 'success') {
			return wx.showToast({
				title: '报名成功',
				icon: 'success',
			});
		}
	},

	// 点击参与人
	onTapUser: function (e) {
		const { idx } = e.currentTarget.dataset;
		this.setData({ selectPersonIdx: Number(idx) });
	},

	// 获取议价详情
	getPriceRecordList: async function () {
		loading.showLoading();
		const { id } = this.data;
		const result = await request.get({ url: '/priceRecord/priceRecordByDemandId', data: { demand_id: id } });
		if (Array.isArray(result)) {
			result.forEach((price) => {
				const records = price.records;
				if (Array.isArray(records)) {
					// 最后一条记录是否是演员报价
					const is_actor_price = Number(records[records.length - 1].type) === 1;
					console.log(Number(records[records.length - 1].type), 2222);
					if (is_actor_price) {
						// 展示议价按钮
						price.showPriceBtn = true;
					} else {
						price.showPriceBtn = false;
					}
				}
			});
		}
		console.log(result, 1111);
		this.setData({ priceRecordList: result });
		loading.hideLoading();
	},
});
