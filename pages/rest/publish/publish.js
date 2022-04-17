import request, { uploadFile } from '../../../utils/request';
import moment from '../../../utils/moment';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		dialogDetail: {}, // 弹框详情
		selectTimeRange: [{}],
		title: '',
		personDetail: {}, // 被雇佣人的详情
		calendarVisible: false, // 日历开关
		startTime: '', // 日期开始时间
		endTime: '', // 日期结束时间
		selectDate: '', // 选择的日期区间
		selectAddress: {
			name: '',
			address: '',
			latitude: '',
			longitude: '',
		}, // 演出地点
		isYesList: ['是', '否'],
		is_authentication: '', // 专业设备认证
		desc: '', // 演出描述
		price: '', // 价格
		tempImgUrlPaths: [], // 设备图
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		// 被邀请人的id
		const user_id = wx.getStorageSync('user_id');
		this.setData({ user_id }, () => {
			this.onSearchUserDetail();
		});
	},

	// 查询用户详情
	onSearchUserDetail: async function () {
		const { user_id } = this.data;
		const detail = await request.get({ url: '/user/userDetail', data: { user_id } });
		this.setData({ personDetail: detail });
	},

	// 点击进去用户详情页面
	onGoToUserDetail: function () {
		const { personDetail } = this.data;
		wx.navigateTo({
			url: `/pages/personDetail/personDetail?user_id=${personDetail.id}`,
		});
	},

	// calendarVisible 日历开关
	onChangeCalendarVisible: function () {
		const { calendarVisible } = this.data;
		this.setData({ calendarVisible: !calendarVisible });
	},

	// 选择日历确定
	onConfirmDate: function (e) {
		const { detail } = e;
		if (!detail || !Array.isArray(detail) || !detail[0]) {
			return wx.showToast({
				title: '请选择日期',
				icon: 'error',
			});
		}
		const selectTimeRange = [
			{
				start_time: moment(detail[0]).format('YYYY-MM-DD'),
				end_time: moment(detail[1]).format('YYYY-MM-DD'),
				type: 3,
			},
		];
		const startTime = moment(detail[0]).format('YYYY.MM.DD');
		const endTime = moment(detail[1]).format('YYYY.MM.DD');
		this.setData({ startTime, endTime, selectDate: `${startTime} - ${endTime}`, selectTimeRange });
		this.onChangeCalendarVisible();
	},

	// 选择演出地点
	onChooseAddress: function () {
		const self = this;
		wx.chooseLocation({
			complete: function (res) {
				if (res.errMsg !== 'chooseLocation:ok') {
					return wx.showToast({
						title: '请选择地址',
						icon: 'error',
					});
				}
				const { address, latitude, longitude, name } = res;
				self.setData({ selectAddress: { address, latitude, longitude, name } });
			},
		});
	},

	// 当输入框失焦
	onIptBlur: function (e) {
		let { value } = e.detail;
		value = String(value).trim();
		this.setData({ title: value });
	},

	// 简介输入框失焦
	onBlurDesc: function (e) {
		let { value } = e.detail;
		value = String(value).trim();
		this.setData({ desc: value });
	},

	// 费用输入框失焦
	onBlurPrice: function (e) {
		let { value } = e.detail;
		value = Number(value);
		if (!(value > 0)) {
			return wx.showToast({
				title: '请输入费用',
				icon: 'error',
			});
		}
		this.setData({ price: value });
	},

	// 选择专业设备认证
	onSelectApprove: function (e) {
		const { isYesList } = this.data;
		const { value } = e.detail;
		this.setData({ is_authentication: isYesList[value] });
	},

	// 选择设备图
	onChooseImg: function () {
		const self = this;
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				const { tempImgUrlPaths } = self.data;
				// tempFilePath可以作为img标签的src属性显示图片
				const { tempFilePaths } = res;
				const len = tempFilePaths.length + tempImgUrlPaths.length;
				if (len > 9) {
					return wx.showToast({
						title: '最多9张图片',
						icon: 'error',
					});
				}
				self.setData({ tempImgUrlPaths: [...tempImgUrlPaths, ...tempFilePaths] });
			},
			fail: function () {
				wx.showToast({
					title: '请重新选择',
					icon: 'error',
				});
			},
		});
	},

	// 移除图片
	onRemoveImg: function (e) {
		const { idx } = e.currentTarget.dataset;
		const { tempImgUrlPaths } = this.data;
		tempImgUrlPaths.splice(idx, 1);
		this.setData({ tempImgUrlPaths });
	},

	// 点击确定
	onTapSure: async function () {
		const self = this;
		setTimeout(async () => {
			const { title, startTime, endTime, selectAddress, is_authentication, desc, price, tempImgUrlPaths } =
				self.data;
			const user_id = wx.getStorageSync('user_id');
			if (!user_id) {
				return wx.showToast({
					title: '发布失败',
					icon: 'error',
				});
			}
			if (!(Number(price) > 0)) {
				return wx.showToast({
					title: '价格不正确',
				});
			}
			if (
				!title ||
				!startTime ||
				!endTime ||
				!is_authentication ||
				!price ||
				!desc ||
				!selectAddress.address ||
				tempImgUrlPaths.length === 0
			) {
				return wx.showToast({
					title: '请完善信息',
					icon: 'error',
				});
			}
			loading.showLoading();
			const uploadImgUrls = [];
			if (tempImgUrlPaths && tempImgUrlPaths.length !== 0) {
				let len = tempImgUrlPaths.length;
				loading.showLoading();
				while (len > 0) {
					len -= 1;
					// eslint-disable-next-line no-await-in-loop
					const fileDetail = await uploadFile({ url: '/device/upload', data: tempImgUrlPaths[len] });
					uploadImgUrls.push(fileDetail.url);
				}
			}
			// 所有校验通过后，上传需求详情
			const params = {
				user_id: user_id,
				name: title,
				start_time: startTime,
				end_time: endTime,
				img_urls: JSON.stringify(uploadImgUrls),
				addressAll: selectAddress.address,
				addressName: selectAddress.name,
				latitude: selectAddress.latitude,
				longitude: selectAddress.longitude,
				desc: desc,
				price: price,
				is_authentication: is_authentication === '是' ? 1 : 2,
			};
			const res = await request.post({ url: '/device/add', data: params });
			if (res === 'success') {
				loading.hideLoading();
				self.setData({
					dialogDetail: {
						title: '发布成功!',
						src: '/asserts/public/publish.png',
						desc: '请前往我的发布页面查看详细内容!',
					},
					dialogVisible: true,
				});
			}
		}, 500);
	},

	// 关闭提示弹框
	onCloseDialog: function () {
		this.setData({ dialogVisible: false });
		wx.switchTab({
			url: '/pages/rest/index/index',
		});
	},
});
