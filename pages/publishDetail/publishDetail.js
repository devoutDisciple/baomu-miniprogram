/* eslint-disable prefer-destructuring */
import request from '../../utils/request';
import loading from '../../utils/loading';
import config from '../../config/config';
import moment from '../../utils/moment';
import login from '../../utils/login';
import { plays, instruments, voices } from '../../constant/constant';

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
		console.log(detail, 111);
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
		detail.send = detail.is_send === 2 ? '不接送' : '接送';
		// 个人竞标状态：detail.detailState: 1-未参与报价 2-竞标结束 3-竞标进行中被拒绝 4-竞标进行中待商议
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
			let { price } = this.data;
			price = String(price).trim();
			if (!(Number(price) > 0)) {
				return wx.showToast({
					title: '报价输入有误',
					icon: 'error',
				});
			}
			const user_id = wx.getStorageSync('user_id');
			const { id } = this.data;
			const result = await request.post({
				url: '/priceRecord/add',
				// type: 1-演员报价 2-需求方报价  state 1-同意 2-拒绝 3-待商议  operation: 第几次谈价
				data: { user_id, price, demand_id: id, type: 1, state: 3, operation: 1 },
			});
			if (result === 'success') {
				this.setData({ priceDialogVisible: false });
				await this.getPublishDetail();
				this.setData({ tipDialog: true });
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
			// type: 1-演员报价 2-需求方报价  state 1-同意 2-拒绝 3-待商议  operation: 第几次谈价
			data: { user_id, id: id },
		});
		if (result === 'success') {
			return wx.showToast({
				title: '报名成功',
				icon: 'success',
			});
		}
	},
});
