import loading from '../../utils/loading';
import login from '../../utils/login';
import request from '../../utils/request';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
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
		// 帖子的用户id
		ownerId: {
			type: String,
			value: '',
		},
		// 是否给该作品点过赞
		hadGoods: {
			type: Boolean,
			value: false,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		replyValue: '',
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 输入框结束
		onBlurIpt: function (e) {
			const { value } = e.detail;
			this.setData({ replyValue: String(value).trim() });
		},
		// 发送
		onSend: async function () {
			loading.showLoading();
			// type: 1-给帖子评论 2-二级评论
			const { replyValue, type, contentId, commentId } = this.data;
			const desc = String(replyValue).trim();
			if (!desc) {
				return wx.showToast({
					title: '请输入内容',
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
			request
				.post({
					url,
					data: {
						user_id,
						content_id: contentId,
						comment_id: commentId,
						type,
						desc,
					},
				})
				.then(() => {
					wx.showToast({
						title: '评论成功',
						icon: 'success',
					});
					this.setData({ replyValue: '' });
					this.triggerEvent('Callback');
					this.triggerEvent('OnClose');
				})
				.finally(() => {
					loading.hideLoading();
				});
		},
		// 点赞
		onTagGood: function () {
			if (!login.isLogin()) return;
			const user_id = wx.getStorageSync('user_id');
			const { type, ownerId, contentId, commentId, hadGoods } = this.data;
			const goods_type = !hadGoods;
			// type   content:给内容的评论点赞 reply：给评论的评论点赞
			request.post({
				url: '/goods/addPostsGoods',
				data: {
					user_id,
					other_id: ownerId,
					content_id: contentId,
					comment_id: commentId,
					goods_type: goods_type,
					type: type === 'content' ? 2 : 3,
				},
			});
			this.setData({ hadGoods: !hadGoods });
		},
	},
});
