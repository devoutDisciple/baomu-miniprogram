import loading from '../../../utils/loading';
import { instruments } from '../../../constant/constant';
import request, { post, uploadFile } from '../../../utils/request';

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
	onLoad: function () {
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
					self.setData({
						videoDetail: {
							url: tempFile.tempFilePath,
							height: tempFile.height,
							width: tempFile.width,
							duration: tempFile.duration,
							size: tempFile.size,
							photo: tempFile.thumbTempFilePath,
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

	// 点击发布
	onPublish: async function () {
		const user_id = wx.getStorageSync('user_id');
		const { instrumentSelectId, tempImgUrlPaths, videoDetail, desc, title } = this.data;
		// if (!desc || !title || !instrumentSelectId) {
		// 	return wx.showToast({
		// 		title: '请完善信息',
		// 		icon: 'error',
		// 	});
		// }
		// if (tempImgUrlPaths.length === 0 && !videoDetail.duration) {
		// 	return wx.showToast({
		// 		title: '请上传作品',
		// 		icon: 'error',
		// 	});
		// }
		loading.showLoading();
		const uploadImgUrls = [];
		if (tempImgUrlPaths && tempImgUrlPaths.length !== 0) {
			let len = tempImgUrlPaths.length;
			loading.showLoading();
			while (len > 0) {
				len -= 1;
				// eslint-disable-next-line no-await-in-loop
				const fileDetail = await uploadFile({ url: '/production/upload', data: tempImgUrlPaths[len] });
				uploadImgUrls.push(fileDetail.url);
			}
		}
		let fileDetail = {};
		if (videoDetail && videoDetail.duration) {
			const videoUrl = await uploadFile({ url: '/production/upload', data: videoDetail.url });
			const coverImgDetail = await uploadFile({ url: '/production/uploadCoverImg', data: videoDetail.photo });
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
		};
		const result = await request.post({ url: '/production/add', data: params });
		if (result === 'success') {
			wx.showToast({
				title: '发布成功',
				icon: 'success',
			});
		}
		loading.hideLoading();
	},
});
