import { person_style } from '../../constant/constant';
import request, { uploadFile } from '../../utils/request';
import loading from '../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		styleList: [], // 擅长风格
		styleName: '', // 风格名称
		styleId: '', // 风格id
		photo: '', // 图片
		nickname: '', // 昵称
		username: '', // 姓名
		desc: '', // 个人简介
		bgUrl: '', // 背景墙
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getPersonStyle();
		this.getUserInfo();
	},

	getUserInfo: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/user/userDetail', data: { user_id } });
		const { photo, nickname, username, desc, style_id, bg_url } = result;
		let styleId = '';
		let styleName = '';
		if (style_id) {
			const selectItem = person_style.filter((item) => item.id === style_id)[0];
			styleId = selectItem.id;
			styleName = selectItem.name;
		}
		this.setData({ photo: photo, nickname: nickname, username, desc, styleId, styleName, bgUrl: bg_url });
		loading.hideLoading();
	},

	getPersonStyle: function () {
		const styleList = person_style.map((item) => item.name);
		this.setData({ styleList });
	},

	// 输入
	onBlurIpt: function (e) {
		const { key } = e.currentTarget.dataset;
		const { value } = e.detail;
		const params = {};
		params[key] = String(value).trim();
		this.setData(params);
	},

	// 个人简介
	onBlurDesc: function (e) {
		const { value } = e.detail;
		this.setData({ desc: value });
	},

	// 选择风格
	stylePickSelect: function (e) {
		const { value } = e.detail;
		const { id: styleId, name: styleName } = person_style[value];
		this.setData({ styleId, styleName });
	},

	// 选择头像
	onChoosePhotoImg: function () {
		const self = this;
		const user_id = wx.getStorageSync('user_id');
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				const { tempFilePaths } = res;
				wx.editImage({
					src: tempFilePaths[0],
					success: async function (filePath) {
						if (filePath.errMsg === 'editImage:ok') {
							self.setData({ photo: filePath.tempFilePath });
							await uploadFile({
								url: '/user/upload',
								data: filePath.tempFilePath,
								formData: { user_id, type: 1 },
							});
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

	// 选择背景墙
	onChooseBgImg: function () {
		const self = this;
		const user_id = wx.getStorageSync('user_id');
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				const { tempFilePaths } = res;
				wx.editImage({
					src: tempFilePaths[0],
					success: async function (filePath) {
						if (filePath.errMsg === 'editImage:ok') {
							self.setData({ bgUrl: filePath.tempFilePath });
							await uploadFile({
								url: '/user/upload',
								data: filePath.tempFilePath,
								formData: { user_id, type: 2 },
							});
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

	// 发送
	onSend: async function () {
		setTimeout(async () => {
			const user_id = wx.getStorageSync('user_id');
			const { styleId, nickname, username, desc } = this.data;
			if (!styleId || !nickname || !username || !desc) {
				return wx.showToast({
					title: '请完善信息',
					icon: 'error',
				});
			}
			const result = await request.post({
				url: '/user/updateInfo',
				data: { style_id: styleId, nickname, username, desc, user_id },
			});
			if (result === 'success') {
				wx.showToast({
					title: '修改成功',
					icon: 'success',
				});
			}
		}, 100);
	},
});
