import { schools, levels } from '../../../constant/constant';
import request, { uploadFile } from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
		dialogShow: false,
		dialogDetail: {
			title: '已提交审核!',
			src: '/asserts/public/publish.png',
			desc: '提交后需1-3个工作日审核，请耐心等待！',
		},
		schoolList: [], // 下拉选择的证书颁发机构
		selectSchoolId: '', // 选择的颁发机构id
		selectSchoolName: '', // 选择的颁发机构名称
		levelList: [], // 下拉选择的证书等级
		selectLevelId: '', // 选择的证书等级id
		selectLevelName: '', // 选择的证书等级名称
		selectDate: '', // 选取的时间
		selectImg: '', // 选择证书
		checkboxValue: false, // 选择框的状态
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		// 获取下拉的选项
		this.getSelectList();
		// 获取用户是否认证装填
		this.getLevelState();
	},

	// 获取用户是否认证装填
	getLevelState: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/level/all', data: { user_id } });
		if (result.state && result.school_id) {
			const { id: selectSchoolId, name: selectSchoolName } = schools.filter(
				(item) => item.id === result.school_id,
			)[0];
			const { id: selectLevelId, name: selectLevelName } = levels.filter(
				(item) => item.id === result.level_id,
			)[0];
			this.setData({
				id: result.id,
				type: result.state,
				selectDate: result.date,
				selectImg: result.url,
				selectSchoolId,
				selectSchoolName,
				selectLevelId,
				selectLevelName,
			});
		}
		loading.hideLoading();
	},

	// 获取下拉的选项
	getSelectList: function () {
		const schoolList = [];
		const levelList = [];
		schools.forEach((item) => {
			schoolList.push(item.name);
		});
		levels.forEach((item) => {
			levelList.push(item.name);
		});
		this.setData({ schoolList, levelList });
	},

	// 选择颁发机构
	onPickSchool: function (e) {
		const { value } = e.detail;
		const selectItem = schools[value];
		this.setData({ selectSchoolId: selectItem.id, selectSchoolName: selectItem.name });
	},

	// 选择证书等级
	onPickLevel: function (e) {
		const { value } = e.detail;
		const selectItem = levels[value];
		this.setData({ selectLevelId: selectItem.id, selectLevelName: selectItem.name });
	},

	// 选择获取时间
	onPickTime: function (e) {
		const { value } = e.detail;
		this.setData({ selectDate: value });
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
				const { tempFilePaths } = res;
				wx.editImage({
					src: tempFilePaths[0],
					success: async function (filePath) {
						if (filePath.errMsg === 'editImage:ok') {
							self.setData({ selectImg: filePath.tempFilePath });
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

	// 选择服务协议和隐私政策
	onCheckChange: function (e) {
		const { value } = e.detail;
		this.setData({ checkboxValue: value });
	},

	// 提交审核
	onSend: async function () {
		const user_id = wx.getStorageSync('user_id');
		const { selectSchoolId, selectLevelId, selectDate, selectImg, checkboxValue } = this.data;
		if (!selectSchoolId || !selectLevelId || !selectDate || !selectImg) {
			return wx.showToast({
				title: '请完善信息',
				icon: 'error',
			});
		}
		if (!checkboxValue) {
			return wx.showModal({
				title: '请先点击确认按钮',
				content: '请同意鲍姆演艺的《用户服务协议》和《隐私政策》',
				showCancel: false,
			});
		}
		loading.showLoading();
		const result = await uploadFile({
			url: '/level/upload',
			data: selectImg,
			formData: { user_id, school_id: selectSchoolId, level_id: selectLevelId, date: selectDate },
		});
		loading.hideLoading();
		if (result && result.url) {
			this.getLevelState();
			this.setData({ dialogShow: true });
		}
	},

	// 关闭弹框
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
							type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
							selectSchoolId: '', // 选择的颁发机构id
							selectSchoolName: '', // 选择的颁发机构名称
							selectLevelId: '', // 选择的证书等级id
							selectLevelName: '', // 选择的证书等级名称
							selectDate: '', // 选取的时间
							selectImg: '', // 选择证书
						});
					}, 500);
				}
			},
		});
	},
});
