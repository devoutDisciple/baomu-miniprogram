import loading from '../../../utils/loading';
import { instruments } from '../../../constant/constant';
import request, { uploadFile } from '../../../utils/request';
import util from '../../../utils/util';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		user_id: '', // 当前用户id，可能是用户或者乐团
		type: 1, // 1-作品 2-动态
		instrumentList: [], // 选择乐器的list
		instrumentSelectName: '',
		instrumentSelectId: '',
		tempImgUrlPaths: [], // 选择的图片
		tempFiles: [], // 选择的图片的详细数据
		videoDetail: {}, // 选取的视频
		desc: '', // 描述信息
		title: '', // 标题
		audioDetail: {}, // 选取的音乐
		progressDialogVisible: false, // 进度条
		uploadPercent: 0, // 上传进度
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { user_id, type } = options;
		if (Number(type) === 1) {
			wx.setNavigationBarTitle({
				title: '添加作品',
			});
		} else {
			wx.setNavigationBarTitle({
				title: '发布动态',
			});
		}
		this.setData({ user_id, type }, () => {
			this.getAllInstruments();
		});
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
				const { tempFilePaths, tempFiles } = res;
				console.log(res, 3222);
				const len = tempFilePaths.length + tempImgUrlPaths.length;
				if (len > 9) {
					return wx.showToast({
						title: '最多9张图片',
						icon: 'error',
					});
				}
				self.setData({ tempImgUrlPaths: [...tempImgUrlPaths, ...tempFilePaths], tempFiles });
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
			success: async (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				// const { tempFilePaths } = res;
				loading.hideLoading();
				if (res && res.errMsg === 'chooseMedia:ok' && Array.isArray(res.tempFiles)) {
					const tempFile = res.tempFiles[0];
					const videoDetail = {
						url: tempFile.tempFilePath,
						height: tempFile.height,
						width: tempFile.width,
						duration: tempFile.duration,
						size: tempFile.size,
						photo: tempFile.thumbTempFilePath,
					};
					console.log(videoDetail, 1111);
					const { newHeight, newWidth } = await util.getVideoSize({
						height: tempFile.height,
						width: tempFile.width,
					});
					videoDetail.videoWidth = newWidth;
					videoDetail.videoHeight = newHeight;
					self.setData({ videoDetail });
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
		const { tempImgUrlPaths, tempFiles } = this.data;
		tempImgUrlPaths.splice(idx, 1);
		tempFiles.splice(idx, 1);
		this.setData({ tempImgUrlPaths, tempFiles });
	},

	// 移除视频
	onRemoveVideo: function () {
		this.setData({ videoDetail: {} });
	},

	// 输入标题
	onBlurTitle: function (e) {
		const { value } = e.detail;
		this.setData({ title: String(value).trim() });
	},

	// 输入内容
	onBlurDesc: function (e) {
		const { value } = e.detail;
		this.setData({ desc: String(value).trim() });
	},

	// 点击发布
	onPublish: async function () {
		try {
			const self = this;
			setTimeout(async () => {
				const { user_id, type } = self.data;
				const { instrumentSelectId, tempImgUrlPaths, tempFiles, videoDetail, desc, title } = self.data;
				if (!desc || !title || !instrumentSelectId) {
					return wx.showToast({
						title: '请完善信息',
						icon: 'error',
					});
				}
				// if (tempImgUrlPaths.length === 0 && !videoDetail.duration) {
				// 	return wx.showToast({
				// 		title: '请上传作品',
				// 		icon: 'error',
				// 	});
				// }
				// 计算将要上传的文件的全部大小
				let fileTotalSize = 0;
				if (tempFiles && tempFiles.length !== 0) {
					// eslint-disable-next-line no-return-assign
					tempFiles.forEach((item) => (fileTotalSize += Number(item.size)));
				}
				if (videoDetail && videoDetail.duration) {
					fileTotalSize += Number(videoDetail.size);
				}
				// 单位是M
				fileTotalSize = parseInt(fileTotalSize / 1000 / 1000);
				// 大于10M,显示进度条
				if (fileTotalSize > 10) {
					this.setData({ progressDialogVisible: true });
					const times = parseInt(((fileTotalSize / 2) * 1000) / 100);
					let newPercent = 0;
					self.timer = setInterval(() => {
						if (newPercent < 98) {
							newPercent++;
							self.setData({ uploadPercent: newPercent });
						}
					}, times);
				} else {
					// 显示loading
					loading.showLoading();
				}

				const uploadImgUrls = [];
				if (tempImgUrlPaths && tempImgUrlPaths.length !== 0) {
					let len = tempImgUrlPaths.length;
					while (len > 0) {
						len -= 1;
						// eslint-disable-next-line no-await-in-loop
						const fileDetail = await uploadFile({
							url: '/production/uploadImg',
							data: tempImgUrlPaths[len],
						});
						uploadImgUrls.push(fileDetail.url);
					}
				}
				let fileDetail = {};
				if (videoDetail && videoDetail.duration) {
					const videoUrl = await uploadFile({ url: '/video/upload', data: videoDetail.url });
					const coverImgDetail = await uploadFile({
						url: '/production/uploadCoverImg',
						data: videoDetail.photo,
					});
					fileDetail = {
						url: videoUrl.url,
						height: videoDetail.height,
						width: videoDetail.width,
						duration: videoDetail.duration,
						size: videoDetail.size,
						photo: coverImgDetail,
					};
				}
				const params = {
					user_id,
					title,
					instr_id: instrumentSelectId,
					desc,
					img_url: uploadImgUrls,
					video: fileDetail,
					type: type,
				};

				const result = await request.post({ url: '/production/add', data: params });
				if (result === 'success') {
					loading.hideLoading();
					// 关闭进度条
					self.setData({ progressDialogVisible: false });
					if (self.timer) {
						clearInterval(self.timer);
					}
					wx.showToast({
						title: '发布成功',
						icon: 'success',
					});
					setTimeout(() => {
						wx.navigateBack({});
					}, 1000);
				}
				loading.hideLoading();
			}, 500);
		} catch (error) {
			const self = this;
			setTimeout(() => {
				loading.hideLoading();
				// 关闭进度条
				self.setData({ progressDialogVisible: false });
				if (self.timer) {
					clearInterval(self.timer);
				}
			}, 500);
		} finally {
			const self = this;
			setTimeout(() => {
				loading.hideLoading();
				// 关闭进度条
				self.setData({ progressDialogVisible: false });
				if (self.timer) {
					clearInterval(self.timer);
				}
			}, 500);
		}
	},
});
