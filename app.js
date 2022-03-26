import { get } from './utils/request';
import config from './config/config';

App({
	globalData: {
		userInfo: null,
		msgsNum: 0, // 消息数量
	},

	data: {},

	onLaunch: function () {
		// 统计各种信息
		if (config.env === 'dev') {
			this.getMyMessage();
		} else {
			setInterval(() => {
				this.getMyMessage();
			}, 1000);
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
		if (String(num) !== '0') {
			wx.setTabBarBadge({
				index: 4,
				text: String(num),
				fail: (err) => {
					console.log(err);
				},
			});
		} else {
			wx.removeTabBarBadge({
				index: 2,
				fail: () => {},
			});
		}
	},
});
