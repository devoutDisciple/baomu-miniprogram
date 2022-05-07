import request, { uploadFile } from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		awardImg: '', // 获奖证书图片
		type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
		dialogShow: false,
		dialogDetail: {
			title: '已提交审核!',
			src: '/asserts/public/publish.png',
			desc: '提交后需1-3个工作日审核，请耐心等待！',
		},
		certificate_gov: '', // 证书颁发机构
		certificate_name: '', // 证书名称
		certificate_level: '', // 名次
		certificate_time: '', // 证书颁发时间
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		// 获取用户是否认证状态
		this.getLevelState();
	},

	// 获取用户是否认证状态
	getLevelState: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/award/all', data: { user_id } });
		if (result.state && result.award_url) {
			this.setData({
				id: result.id,
				awardImg: result.award_url,
				name: result.name,
				certificate_gov: result.certificate_gov,
				certificate_name: result.certificate_name,
				certificate_level: result.certificate_level,
				certificate_time: result.certificate_time,
				type: result.state,
			});
		}
		loading.hideLoading();
	},

	// 用户完成输入e
	onBlurInput: function (e) {
		const { key } = e.currentTarget.dataset;
		const { value } = e.detail;
		const params = {};
		params[key] = String(value).trim();
		this.setData(params);
	},

	// 选择时间
	onPickTime: function (e) {
		const { key } = e.currentTarget.dataset;
		const { value } = e.detail;
		const params = {};
		params[key] = value;
		this.setData(params);
	},

	// 选择照片
	onChooseImg: function () {
		const self = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				const {
					tempFilePaths: [tempFilePath],
				} = res;
				wx.editImage({
					src: tempFilePath,
					success: async function (filePath) {
						if (filePath.errMsg === 'editImage:ok') {
							self.setData({ awardImg: filePath.tempFilePath });
						}
					},
					fail: function () {},
				});
			},
			fail: function () {
				wx.showToast({
					title: '请重新选择',
					icon: 'error',
				});
			},
		});
	},

	// 提交审核
	onSend: async function () {
		const user_id = wx.getStorageSync('user_id');
		const {
			awardImg, // 获奖证书图片
			certificate_gov, // 证书颁发机构
			certificate_name, // 证书名称
			certificate_level, // 名次
			certificate_time, // 证书颁发时间
		} = this.data;
		if (!awardImg || !certificate_gov || !certificate_name || !certificate_level || !certificate_time) {
			return wx.showToast({
				title: '请完善信息',
				icon: 'error',
			});
		}
		loading.showLoading();
		const resultAwardImg = await uploadFile({ url: '/award/upload', data: awardImg });
		const newAwardImg = resultAwardImg.url;
		const result = await request.post({
			url: '/award/add',
			data: {
				user_id,
				award_url: newAwardImg,
				certificate_gov,
				certificate_name,
				certificate_level,
				certificate_time,
			},
		});
		loading.hideLoading();
		if (result === 'success') {
			this.getLevelState();
			this.setData({ dialogShow: true });
		}
	},

	onCloseDialog: function () {
		this.setData({ dialogShow: false });
		wx.navigateBack({});
	},

	// 删除
	onTapDelete: function () {
		const self = this;
		const user_id = wx.getStorageSync('user_id');
		wx.showModal({
			title: '删除认证',
			content: '是否确认删除该认证信息，并重新认证',
			success: async function (e) {
				const { confirm, errMsg } = e;
				if (errMsg === 'showModal:ok' && confirm) {
					const { id } = self.data;
					loading.showLoading();
					await request.post({ url: '/level/deleteItemById', data: { id: id, user_id } });
					loading.hideLoading();
					wx.showToast({
						title: '已删除',
					});
					setTimeout(() => {
						self.setData({
							id: '',
							awardImg: '', // 获奖证书图片
							type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
							certificate_gov: '', // 证书颁发机构
							certificate_name: '', // 证书名称
							certificate_level: '', // 名次
							certificate_time: '', // 证书颁发时间
						});
					}, 500);
				}
			},
		});
	},
});
