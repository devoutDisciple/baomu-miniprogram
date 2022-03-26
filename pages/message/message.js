// eslint-disable-next-line import/named
import util, { formatTime } from '../../utils/util';
import moment from '../../utils/moment';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		myReceiveGoodsNum: 0, // 我收到的点赞量
		myReceiveCommentsNum: 0, // 我收到的评论数量
		msgData: [], // 消息
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow: function () {
		// this.getTotalNum();
		// this.setStoreageMsg();
		this.getStorageMsg();
	},

	// 模拟数据存储
	setStoreageMsg: function () {
		const data = [
			{
				person_id: -1, // 发送信息的人
				person_name: '系统通知', // 发送信息人的名字
				noread: 0, // 未读信息数量
				msgType: 2, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
				msg: [
					{
						content: 'sjdfjdks', // 消息内容
						time: '2022-02-22 12:00:00', // 发送时间
					},
				], // 具体信息
			},
			{
				person_id: -2, // 发送信息的人
				person_name: '订单推送', // 发送信息人的名字
				noread: 0, // 未读信息数量
				msgType: 3, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
				msg: [
					{
						content: 'sjdfjdks', // 消息内容
						time: '2022-02-22 12:00:00', // 发送时间
					},
				], // 具体信息
			},
			{
				person_id: -3, // 发送信息的人
				person_name: '邀请信息', // 发送信息人的名字
				noread: 0, // 未读信息数量
				msgType: 4, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
				msg: [
					{
						content: 'sjdfjdks', // 消息内容
						time: '2022-02-22 12:00:00', // 发送时间
					},
				], // 具体信息
			},
			// {
			// 	person_id: 17, // 发送信息的人
			// 	person_name: '测试账号2', // 发送信息人的名字
			// 	person_photo: 'http://localhost:8888/photo/D9SXV44EL168JNDW-1623772814994.png', // 发送信息人的头像
			// 	noread: 11, // 未读信息数量
			// 	msgType: 1, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
			// 	msg: [
			// 		{
			// 			content: '个人发送信息',
			// 			from: 2, // 1-代表自己发送的 2-别人发送的
			// 			// "2021-11-12 12:00:00"
			// 			time: '2022-02-22 12:00:00',
			// 			type: 1, // 1-文字 2-图片
			// 		},
			// 	], // 具体信息
			// },
		];
		wx.setStorageSync('msg_data', JSON.stringify(data));
	},

	// 从缓存中读取信息
	getStorageMsg: function () {
		let msgData = wx.getStorageSync('msg_data');
		if (msgData) {
			msgData = JSON.parse(msgData);
			if (Array.isArray(msgData)) {
				msgData.forEach((item) => {
					if (Array.isArray(item.msg) && item.msg.length !== 0) {
						const lastMsg = item.msg[item.msg.length - 1];
						if (typeof lastMsg.content === 'string') {
							item.lastMsgTxt = lastMsg.content || '';
						} else {
							item.lastMsgTxt = '[图片]';
						}
						item.lastMsgTime = util.getMsgShowTime(lastMsg.time);
						item.lastMsgRelTime = lastMsg.time;
					}
				});
			}

			this.setData({ msgData: msgData });
		}
	},

	// 获取统计信息
	getTotalNum: function () {
		// 设置点赞数量
		// this.setData({ myReceiveGoodsNum: getApp().globalData.myReceiveGoodsNum });
		// // 评论数量
		// this.setData({ myReceiveCommentsNum: getApp().globalData.myReceiveCommentsNum });
		// // 消息数量
		// setInterval(() => {
		// 	this.setData({ myReceiveGoodsNum: getApp().globalData.myReceiveGoodsNum });
		// 	// 设置点赞数量
		// 	this.setData({ myReceiveCommentsNum: getApp().globalData.myReceiveCommentsNum });
		// }, 3000);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

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
