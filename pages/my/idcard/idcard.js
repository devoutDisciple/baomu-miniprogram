import request, { uploadFile } from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		idcard1: '', // 身份证正面
		idcard2: '', // 反面
		type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
		dialogShow: false,
		dialogDetail: {
			title: '已提交审核!',
			src: '/asserts/public/publish.png',
			desc: '提交后需1-3个工作日审核，请耐心等待！',
		},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getUserState();
	},

	// 获取用户是否认证装填
	getUserState: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/idcard/all', data: { user_id } });
		if (result.state && result.idcard1) {
			this.setData({
				idcard1: result.idcard1,
				idcard2: result.idcard2,
				type: result.state,
			});
		}
		loading.hideLoading();
	},

	// 选择照片
	onChooseImg: function (e) {
		const { type } = e.currentTarget.dataset;
		const self = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				const { tempFilePaths } = res;
				wx.editImage({
					src: tempFilePaths[0],
					success: async function (filePath) {
						if (filePath.errMsg === 'editImage:ok') {
							if (Number(type) === 1) {
								self.setData({ idcard1: filePath.tempFilePath });
							} else {
								self.setData({ idcard2: filePath.tempFilePath });
							}
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
		const { idcard1, idcard2 } = this.data;
		const user_id = wx.getStorageSync('user_id');
		if (!idcard1 || !idcard2) {
			return wx.showToast({
				title: '请完善信息',
				icon: 'error',
			});
		}
		loading.showLoading();
		const idcard1Img = await uploadFile({ url: '/idcard/upload', data: idcard1 });
		const idcard2Img = await uploadFile({ url: '/idcard/upload', data: idcard2 });
		const result = await request.post({
			url: '/idcard/add',
			data: { user_id, idcard1: idcard1Img.url, idcard2: idcard2Img.url },
		});
		loading.hideLoading();
		if (result === 'success') {
			this.setData({ dialogShow: true });
		}
	},

	// 关闭弹框
	onCloseDialog: function () {
		this.setData({ dialogShow: false });
		wx.navigateBack({});
	},
});
