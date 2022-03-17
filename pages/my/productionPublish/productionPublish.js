import loading from '../../../utils/loading';
import { instruments, plays, voices } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		instrumentList: [], // 选择乐器的list
		instrumentSelectName: '',
		instrumentSelectId: '',
		tempImgUrlPaths: [], // 选择的图片
		videoDetail: {}, // 选取的视频
		desc: '', // 描述信息
		title: '', // 标题
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getAllInstruments();
	},

	// 获取所有乐器类型
	getAllInstruments: function () {
		const instrumentList = [];
		instruments.forEach((item) => instrumentList.push(item.name));
		this.setData({ instrumentList: instrumentList || [] });
	},

	// 选择乐器类型的时候
	onPickInstruments: function (e) {
		const { value } = e.detail;
		const { name, id } = instruments[value];
		this.setData({ instrumentSelectName: name, instrumentSelectId: id });
	},

	// 选择图片
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

	// 选择视频
	onChooseVideo: function () {
		const self = this;
		wx.chooseMedia({
			count: 1,
			compressed: false,
			sizeType: ['original', 'original'],
			mediaType: ['video'], // 文件类型
			sourceType: ['album', 'camera'], // 视频来源
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				// const { tempFilePaths } = res;
				loading.hideLoading();
				if (res && res.errMsg === 'chooseMedia:ok' && Array.isArray(res.tempFiles)) {
					const tempFile = res.tempFiles[0];
					// const { height, width } = tempFile;
					// const { screenWidth } = self.data;
					// const videoHeight = Number((height * screenWidth) / width).toFixed(0);
					self.setData({
						videoDetail: {
							url: tempFile.tempFilePath,
							height: tempFile.height,
							width: tempFile.width,
							duration: tempFile.duration,
							size: tempFile.size,
							photo: tempFile.thumbTempFilePath,
							// videoHeight,
						},
					});
				}
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

	// 移除视频
	onRemoveVideo: function () {
		this.setData({ videoDetail: {} });
	},

	// 输入标题
	onBlurTitle: function (e) {
		const { value } = e.detail;
		this.setData({ title: value });
	},

	// 输入内容
	onBlurDesc: function (e) {
		const { value } = e.detail;
		this.setData({ desc: value });
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
