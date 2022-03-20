import { post, uploadFile } from '../../utils/request';
import emoji from '../../config/emoji';
import loading from '../../utils/loading';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 输入框是否可见
		visible: {
			type: Boolean,
			value: false,
		},
		// 输入框聚焦
		focus: {
			type: Boolean,
			value: false,
		},
		//  1-给帖子评论 2-二级评论
		type: {
			type: Number,
			value: 1,
		},
		// 评论id
		commentId: {
			type: String,
			value: '',
		},
		// 帖子id
		contentId: {
			type: String,
			value: '',
		},
		// 点击发送之后的回调函数
		callback: {
			type: Function,
			value: () => {},
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		focus: true,
		replyValue: '',
		tempUrlPaths: [], // 图片路径
		showEmoji: false,
		emojis: emoji.emoji,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 展示emoji
		onShowEmoji: function () {
			const { showEmoji } = this.data;
			if (!showEmoji) {
				this.setData({ showEmoji: true, focus: true });
			} else {
				this.setData({ showEmoji: false, focus: false });
			}
		},
		// 点击emoji
		onClickEmoji: function (e) {
			const { replyValue } = this.data;
			const { item } = e.currentTarget.dataset;
			this.setData({ replyValue: `${replyValue} ${item} ` });
		},
		// 失去焦点
		onBlur: function () {
			this.setData({ focus: false });
		},
		// 聚焦的时候
		onFocus: function () {
			this.setData({ focus: true, showEmoji: false });
		},
		// 点击输入框
		onTapIpt: function () {
			this.setData({ focus: true, showEmoji: false });
		},
		// 键盘高度发生改变
		keyboardheightchange: function () {},
		// 关闭的时候
		onClose: function () {
			this.setData({ replyValue: '', tempUrlPaths: [], showEmoji: false, focus: false });
			this.triggerEvent('OnClose');
		},
		// 输入框改变
		onChangeValue: function (e) {
			this.setData({ replyValue: e.detail.value });
		},

		// 点击发送
		onSendMsg: async function () {
			loading.showLoading();
			// type: 1-给帖子评论 2-二级评论
			const { replyValue, type, contentId, commentId, tempUrlPaths } = this.data;
			const desc = String(replyValue).trim();
			if (!desc && (!tempUrlPaths || tempUrlPaths.length === 0)) {
				return wx.showToast({
					title: '请输入评论',
					icon: 'error',
				});
			}
			const user_id = wx.getStorageSync('user_id');
			let url = '/reply/addContentReply';
			// 给帖子评论
			if (type === 1) {
				url = '/reply/addContentReply';
			} else {
				// 给评论评论
				url = '/reply/addReplyReply';
			}
			// 上传图片
			const uploadImgUrls = [];
			if (tempUrlPaths && tempUrlPaths.length !== 0) {
				let len = tempUrlPaths.length;
				loading.showLoading();
				while (len > 0) {
					len -= 1;
					// eslint-disable-next-line no-await-in-loop
					const fileDetail = await uploadFile({ url: '/reply/uploadImg', data: tempUrlPaths[len] });
					uploadImgUrls.push(fileDetail);
				}
			}
			post({
				url,
				data: {
					user_id,
					content_id: contentId,
					comment_id: commentId,
					type,
					desc,
					img_urls: uploadImgUrls,
				},
			})
				.then(() => {
					wx.showToast({
						title: '评论成功',
						icon: 'success',
					});
					this.triggerEvent('Callback');
					this.triggerEvent('OnClose');
				})
				.finally(() => {
					loading.hideLoading();
				});
		},

		// 点击选择图片
		onChooseImg: function () {
			const self = this;
			wx.chooseImage({
				count: 9,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success(res) {
					const { tempUrlPaths } = self.data;
					// tempFilePath可以作为img标签的src属性显示图片
					const { tempFilePaths } = res;
					const len = tempFilePaths.length + tempUrlPaths.length;
					if (len > 9) {
						return wx.showToast({
							title: '最多9张图片',
							icon: 'error',
						});
					}
					self.setData({ tempUrlPaths: [...tempUrlPaths, ...tempFilePaths] });
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
			const { tempUrlPaths } = this.data;
			tempUrlPaths.splice(idx, 1);
			this.setData({ tempUrlPaths });
		},
	},

	// observers: {
	// 	'focus, visible': function (focus, visible) {
	// 		console.log(focus, visible, 1231);
	// 	},
	// },
});
