/* eslint-disable prefer-destructuring */
import request from '../../utils/request';
import loading from '../../utils/loading';
import config from '../../config/config';
import moment from '../../utils/moment';
import login from '../../utils/login';
import { PLAYS_STYLE, instruments, voices } from '../../constant/constant';

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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { id } = options;
		this.setData({ id: id }, () => {
			this.getPublishDetail();
		});
	},

	getPublishDetail: async function () {
		loading.showLoading();
		const { id } = this.data;
		const user_id = wx.getStorageSync('user_id');
		if (!login.isLogin()) {
			await login.getLogin();
		}
		let detail = await request.get({ url: '/demand/detailById', data: { id, user_id } });
		// 获取演奏类型
		const { name: playName } = PLAYS_STYLE.filter((p) => p.id === Number(detail.play_id))[0];
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
		// 个人竞标状态：detail.detailState: 1-未参与竞标 2-竞标进行中待商议 3-报名中 4-被拒绝  5-中标
		this.setData({ detail: detail });
		loading.hideLoading();
	},

	// 点击竞价
	onTapPrice: function () {
		const cur_user_id = wx.getStorageSync('user_id');
		const { user_id } = this.data.detail;
		if (Number(cur_user_id) === Number(user_id)) {
			return wx.showToast({
				title: '己方不可参与',
				icon: 'error',
			});
		}
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
			let { price } = this.data;
			price = String(price).trim();
			if (!(Number(price) > 0)) {
				return wx.showToast({
					title: '报价输入有误',
					icon: 'error',
				});
			}
			loading.showLoading();
			// 需求发布人的id
			const { user_id: publisher_id } = this.data.detail;
			// 参与报价人的id
			const user_id = wx.getStorageSync('user_id');
			const { id } = this.data;
			const result = await request.post({
				url: '/priceRecord/add',
				// type: 1-演员报价 2-需求方报价
				// state 1-未参与竞标 2-竞标进行中待商议 3-被拒绝  4-中标
				// operation: 第几次谈价
				data: { user_id, publisher_id, price, demand_id: id, type: 1, state: 2, operation: 1 },
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
		const cur_user_id = wx.getStorageSync('user_id');
		const { user_id } = this.data.detail;
		if (Number(cur_user_id) === Number(user_id)) {
			return wx.showToast({
				title: '己方不可参与',
				icon: 'error',
			});
		}
		const { id } = this.data;
		const result = await request.post({
			url: '/demand/signDemand',
			// type: 1-演员报价 2-需求方报价
			// state 1-未参与竞标 2-竞标进行中待商议 3-被拒绝  4-中标
			// operation: 第几次谈价
			data: { user_id: cur_user_id, id: id },
		});
		if (result === 'success') {
			return wx.showToast({
				title: '报名成功',
				icon: 'success',
			});
		}
	},
});
