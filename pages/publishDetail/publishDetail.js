/* eslint-disable prefer-destructuring */
import request from '../../utils/request';
import loading from '../../utils/loading';
import config from '../../config/config';
import moment from '../../utils/moment';
import { plays, instruments, voices } from '../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		detail: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { id } = options;
		this.setData({ id: id }, () => {
			this.getPublishDetail(id);
		});
	},

	getPublishDetail: async function (id) {
		loading.showLoading();
		let detail = await request.get({ url: '/demand/detailById', data: { id } });
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
		console.log(detail, 111);
		const timeFormat = 'YYYY.MM.DD';
		detail.date = `${moment(detail.start_time).format(timeFormat)} - ${moment(detail.end_time).format(timeFormat)}`;
		detail.bargain = detail.is_bargain === 2 ? '不可议价' : '可议价';
		detail.food = detail.is_food === 2 ? '不包食宿' : '包食宿';
		detail.send = detail.is_send === 2 ? '不接送' : '接送';
		this.setData({ detail: detail });
		loading.hideLoading();
	},
});
