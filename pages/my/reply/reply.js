import { get } from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		visible: false,
		focus: true,
		currentReply: {},
		replyList: [],
		commentId: '', // 评论的id
		contentId: '', // 内容的id
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { commentId, contentId } = options;
		if (!commentId) {
			return wx.switchTab({
				url: '/pages/home/home',
			});
		}
		this.setData({ commentId, contentId }, () => {
			this.getReplyData();
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	// 获取当前评论详情
	getReplyData: async function () {
		const { commentId } = this.data;
		const user_id = wx.getStorageSync('user_id');
		const currentReply = await get({ url: '/reply/replyDetailById', data: { comment_id: commentId, user_id } });
		console.log(currentReply, 23883);
		this.setData({ currentReply: currentReply || {} }, () => {
			this.onSerchReplyList();
		});
	},

	// 获取评论的评论的列表
	onSerchReplyList: async function () {
		const { currentReply } = this.data;
		const user_id = wx.getStorageSync('user_id');
		// 获取评论的评论的列表
		const replyList = await get({ url: '/reply/replyListByReplyId', data: { id: currentReply.id, user_id } });
		this.setData({ replyList });
	},

	//   输入框聚焦
	openReply: function () {
		this.setData({ visible: true });
		setTimeout(() => {
			this.setData({ focus: true });
		}, 200);
	},

	onCloseIptDialog: function () {
		this.setData({ visible: false, focus: false });
	},
});
