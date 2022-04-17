import { person_style } from '../../../constant/constant';
import request, { uploadFile } from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		photo: '', // 乐队头像
		bgImg: '', // 毕业证书图片
		userIds: [], // 邀请的用户id
		userDetails: [], // 邀请的用户详情
		dialogShow: false,
		dialogDetail: {
			title: '创建成功',
			src: '/asserts/public/publish.png',
			desc: '乐队创建成功',
		},
		name: '', // 乐队姓名
		study_list: [], // 乐队演奏风格
		study_id: '', // 乐队演奏风格id
		study_name: '', // 乐队演奏风格名称
		desc: '', // 乐队简介
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		// 获取乐队演奏风格下拉选项
		this.getStudyType();
		this.getUserDetails();
	},

	// 获取乐队演奏风格下拉选项
	getStudyType: function () {
		const study_list = [];
		person_style.forEach((item) => study_list.push(item.name));
		this.setData({ study_list: study_list });
	},

	// 用户完成输入e
	onBlurInput: function (e) {
		const { key } = e.currentTarget.dataset;
		const { value } = e.detail;
		const params = {};
		params[key] = String(value).trim();
		this.setData(params);
	},

	// 输入乐队简介
	onBlurDesc: function (e) {
		const { value } = e.detail;
		this.setData({ desc: String(value).trim() });
	},

	// 选择演奏风格
	onPickStudy: function (e) {
		const { value } = e.detail;
		const selectItem = person_style[value];
		this.setData({ study_id: selectItem.id, study_name: selectItem.name });
	},

	// 点击邀请
	onTapInvitation: function () {
		wx.navigateTo({
			url: '/pages/team/invitation/invitation',
		});
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
				const {
					tempFilePaths: [tempFilePath],
				} = res;
				const params = {};
				params[type] = tempFilePath;
				self.setData(params);
			},
			fail: function () {
				wx.showToast({
					title: '请重新选择',
					icon: 'error',
				});
			},
		});
	},

	// 关闭弹框
	onCloseDialog: function () {
		this.setData({ dialogShow: false });
		wx.navigateBack({
			complete: () => {},
		});
	},

	// 获取用户位置
	getUserLocation: function () {
		const self = this;
		return new Promise((resolve, reject) => {
			wx.getLocation({
				isHighAccuracy: true,
				type: 'gcj02',
				complete: function (res) {
					if (res.errMsg === 'getLocation:ok') {
						const { latitude, longitude } = res;
						resolve({ latitude, longitude });
					} else {
						self.hadGetUserPermission();
					}
				},
			});
		});
	},

	// 检测用户是否已经授权地理位置
	hadGetUserPermission: function () {
		const self = this;
		wx.getSetting({
			complete: (res) => {
				if (res.errMsg === 'getSetting:ok') {
					if (!res.authSetting['scope.userLocation']) {
						wx.showModal({
							title: '您未开启地理位置授权',
							content: '为了为您提供更好的服务，请您授权地理位置信息的获取',
							success: (info) => {
								if (info.confirm) {
									wx.openSetting({
										success: function (setting) {
											if (setting.authSetting['scope.userLocation']) {
												// 表明此时已授权
												self.getUserLocation();
											} else {
												// 表明此时还不授权
												self.hadGetUserPermission();
											}
										},
									});
								} else {
									self.hadGetUserPermission();
								}
							},
						});
					}
				}
			},
		});
	},

	// 获取邀请用户的详情
	getUserDetails: async function () {
		const { userIds } = this.data;
		if (userIds.length === 0) {
			this.setData({ userDetails: [] });
			return;
		}
		let newUserIds = [...userIds];
		if (newUserIds.length > 2) {
			newUserIds = newUserIds.splice(0, 3);
		}
		const result = await request.get({ url: '/user/invitationUserDetail', data: { user_ids: newUserIds } });
		this.setData({ userDetails: result });
	},

	// 提交
	onSend: async function () {
		const user_id = wx.getStorageSync('user_id');
		const { latitude, longitude } = await this.getUserLocation();
		const {
			photo, // 乐队头像
			bgImg, // 毕业证书图片
			userIds, // 邀请的用户id
			name, // 乐队姓名
			study_id, // 乐队演奏风格id
			desc, // 乐队简介
		} = this.data;
		if (!photo || !bgImg || !userIds || !name || !study_id || !desc) {
			return wx.showToast({
				title: '请完善信息',
				icon: 'error',
			});
		}
		if (!userIds.includes(user_id)) {
			userIds.unshift(user_id);
		}
		const team_user_ids = userIds.join(',');
		loading.showLoading();
		const resultPhotoImg = await uploadFile({ url: '/team/upload', data: photo });
		const resultBgImg = await uploadFile({ url: '/team/upload', data: bgImg });
		const newPhotoImg = resultPhotoImg.url;
		const newBgImg = resultBgImg.url;
		const result = await request.post({
			url: '/team/add',
			data: {
				user_id,
				name,
				photo: newPhotoImg,
				bg_url: newBgImg,
				team_user_ids,
				study_id,
				desc,
				latitude,
				longitude,
			},
		});
		loading.hideLoading();
		if (result === 'success') {
			this.setData({ dialogShow: true });
		}
	},
});
