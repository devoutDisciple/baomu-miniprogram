import { get } from './utils/request';
import utils from './utils/util';

App({
	globalData: {
		userInfo: null,
	},

	data: {
		goodsTimer: null, // 刷新点赞的记录
	},

	onLaunch: function () {},

	// 各种统计信息
	getTotalMsg: async function () {
		// 获取收到的点赞
		const goodsNum = await this.getGoodsByUser();
		// 获取收到评论的数量
		const commnsNum = await this.getCommentsNumByUser();
		// 获取消息
		const msgsNum = await this.getMyMessage();
		let totalNum = (Number(goodsNum) + Number(commnsNum) + Number(msgsNum)).toFixed(0);
		totalNum = totalNum > 99 ? '99+' : totalNum;
		// const pages = getCurrentPages();
		// const currentPage = pages[pages.length - 1];
		if (String(totalNum) !== '0') {
			wx.setTabBarBadge({
				index: 2,
				text: String(totalNum),
				fail: () => {},
			});
		} else {
			wx.removeTabBarBadge({
				index: 2,
				fail: () => {},
			});
		}
	},

	// 获取消息
	getMyMessage: async function () {
		const user_id = wx.getStorageSync('user_id');
		if (!user_id) return 0;
		const res = await get({ url: '/message/msgsByUserId', data: { user_id } });
		let msgData = wx.getStorageSync('msg_data') || '[]';
		msgData = JSON.parse(msgData);
		if (res && Array.isArray(res.data) && res.data.length !== 0) {
			const { data } = res;
			data.forEach((item) => {
				const currentMsg = msgData.filter((msg) => item.user_id === msg.person_id)[0];
				let { content } = item;
				if (item.type === 2) {
					content = JSON.parse(item.content);
				}
				if (currentMsg) {
					currentMsg.noread = Number(currentMsg.noread) + 1;
					currentMsg.msg.push({
						content: content,
						from: 2,
						time: item.create_time,
						type: item.type,
					});
				} else {
					msgData.push({
						person_id: item.user_id,
						person_name: item.username,
						person_photo: item.user_photo,
						noread: 1,
						msg: [
							{
								content: content,
								from: 2,
								time: item.create_time,
								type: item.type,
							},
						],
					});
				}
			});
			wx.setStorageSync('msg_data', JSON.stringify(msgData));
		}
		let num = 0;
		if (msgData && msgData.length !== 0) {
			msgData.forEach((item) => {
				num += Number(item.noread) || 0;
			});
		}
		this.globalData.msgsNum = num > 99 ? '99+' : num;
		return num;
	},

	// 获取收到的点赞
	getGoodsByUser: async function () {
		const user_id = wx.getStorageSync('user_id');
		if (!user_id) return 0;
		const now = utils.formatTime(new Date());
		let search_goods_time = wx.getStorageSync('search_goods_time');
		if (!user_id) return '';
		if (!search_goods_time) {
			wx.setStorageSync('search_goods_time', now);
			search_goods_time = now;
		}
		const res = await get({ url: '/goods/goodsMyNumByUser', data: { user_id, time: search_goods_time } });
		const { goodsNum } = res;
		this.globalData.myReceiveGoodsNum = goodsNum > 99 ? '99+' : goodsNum;
		return goodsNum || 0;
	},

	// 获取评论量
	getCommentsNumByUser: async function () {
		const user_id = wx.getStorageSync('user_id');
		if (!user_id) return 0;
		const now = utils.formatTime(new Date());
		let search_comment_time = wx.getStorageSync('search_comment_time');
		if (!user_id) return '';
		if (!search_comment_time) {
			wx.setStorageSync('search_comment_time', now);
			search_comment_time = now;
		}
		const res = await get({ url: '/goods/commentsNumByUser', data: { user_id, time: search_comment_time } });
		const { commentsNum } = res;
		this.globalData.myReceiveCommentsNum = commentsNum > 99 ? '99+' : commentsNum;
		return commentsNum || 0;
	},
});
