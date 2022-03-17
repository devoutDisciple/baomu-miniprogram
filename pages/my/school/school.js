import { study_type } from '../../../constant/constant';
import request, { uploadFile } from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		schoolImg: '', // 毕业证书图片
		awardImg: '', // 获奖证书图片
		type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
		dialogShow: false,
		dialogDetail: {
			title: '已提交审核!',
			src: '/asserts/public/publish.png',
			desc: '提交后需1-3个工作日审核，请耐心等待！',
		},
		name: '', // 用户姓名
		idcard: '', // 身份证号
		school_name: '', // 学校名称
		graduation_time: '', // 毕业时间
		study_list: [], // 学习形式
		study_id: '', // 选择的学习形式id
		study_name: '', // 选择的学习形式name
		certificate_gov: '', // 证书颁发机构
		certificate_name: '', // 证书名称
		certificate_level: '', // 名次
		certificate_time: '', // 证书颁发时间
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		// 获取学习形式下拉选项
		this.getStudyType();
		// 获取用户是否认证状态
		this.getLevelState();
	},

	// 获取学习形式下拉选项
	getStudyType: function () {
		const study_list = [];
		study_type.forEach((item) => study_list.push(item.name));
		this.setData({ study_list: study_list });
	},

	// 获取用户是否认证状态
	getLevelState: async function () {
		loading.showLoading();
		const user_id = wx.getStorageSync('user_id');
		const result = await request.get({ url: '/school/all', data: { user_id } });
		if (result.state && result.school_url) {
			const { id: study_id, name: study_name } = study_type.filter((item) => item.id === result.study_id)[0];
			this.setData({
				study_id,
				study_name,
				schoolImg: result.school_url,
				awardImg: result.award_url,
				name: result.name,
				idcard: result.idcard,
				school_name: result.school_name,
				graduation_time: result.graduation_time,
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

	// 选择学习形式
	onPickStudy: function (e) {
		const { value } = e.detail;
		const selectItem = study_type[value];
		this.setData({ study_id: selectItem.id, study_name: selectItem.name });
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

	// 提交审核
	onSend: async function () {
		const user_id = wx.getStorageSync('user_id');
		const {
			schoolImg, // 毕业证书图片
			awardImg, // 获奖证书图片
			name, // 用户姓名
			idcard, // 身份证号
			school_name, // 学校名称
			graduation_time, // 毕业时间
			study_id, // 选择的学习形式id
			certificate_gov, // 证书颁发机构
			certificate_name, // 证书名称
			certificate_level, // 名次
			certificate_time, // 证书颁发时间
		} = this.data;
		if (
			!schoolImg ||
			!awardImg ||
			!name ||
			!idcard ||
			!school_name ||
			!graduation_time ||
			!study_id ||
			!certificate_gov ||
			!certificate_name ||
			!certificate_level ||
			!certificate_time
		) {
			return wx.showToast({
				title: '请完善信息',
				icon: 'error',
			});
		}
		loading.showLoading();
		const resultSchoolImg = await uploadFile({ url: '/school/upload', data: schoolImg });
		const resultAwardImg = await uploadFile({ url: '/school/upload', data: awardImg });
		const newSchoolImg = resultSchoolImg.url;
		const newAwardImg = resultAwardImg.url;
		const result = await request.post({
			url: '/school/add',
			data: {
				user_id,
				school_url: newSchoolImg,
				award_url: newAwardImg,
				name,
				idcard,
				school_name,
				graduation_time,
				study_id,
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
});
