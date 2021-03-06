import { get } from './utils/request';
import config from './config/config';
import moment from './utils/moment';

App({
	globalData: {
		userInfo: null,
		msgsNum: 0, // 消息数量
		demandsNum: 0, // 未处理订单数量
		currentTime: 0,
	},

	data: {},

	onLaunch: function () {
		// 统计各种信息
		if (config.env === 'dev') {
			this.getMyMessage();
		} else {
			if (this.timer) return;
			this.timer = setInterval(() => {
				this.getMyMessage();
			}, 10 * 1000);
		}
	},

	// 获取消息
	getMyMessage: async function () {
		const user_id = wx.getStorageSync('user_id');
		if (!user_id) return 0;
		let msg_accept_time = wx.getStorageSync('msg_accept_time');
		if (!msg_accept_time) {
			const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
			wx.setStorageSync('msg_accept_time', now_time);
			msg_accept_time = now_time;
		}
		const { currentTime } = this.globalData;
		const nowTime = new Date().getTime();
		if (nowTime - currentTime < 10 * 1000) return;
		this.globalData.currentTime = nowTime;
		// 查询是否有未读信息
		get({ url: '/message/msgsByUserId', data: { user_id, msg_accept_time } }).then(async (res) => {
			wx.setStorageSync('msg_accept_time', moment().format('YYYY-MM-DD HH:mm:ss'));
			let msgData = wx.getStorageSync('msg_data') || '[]';
			msgData = JSON.parse(msgData);
			if (res && Array.isArray(res.data) && res.data.length !== 0) {
				const { data } = res;
				data.forEach((item) => {
					// type  1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
					// 普通信息发送
					if (item.type === 1) {
						const currentMsg = msgData.filter((msg) => item.user_id === msg.person_id)[0];
						const msgTxt = {
							content: item.content,
							from: 2, // 1-本人 2-其他人
							time: item.create_time,
						};
						if (currentMsg) {
							currentMsg.noread = Number(currentMsg.noread) + 1;
							currentMsg.msg.push(msgTxt);
						} else {
							msgData.push({
								person_id: item.user_id,
								person_name: item.username,
								person_photo: item.user_photo,
								noread: 1,
								msgType: 1, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
								msg: [msgTxt],
							});
						}
					}
					// 系统通知
					if (item.type === 2) {
						const currentMsg = msgData.filter((msg) => Number(msg.msgType) === item.type)[0];
						const msgTxt = {
							content: item.content,
							from: 2, // 1-本人 2-其他人
							time: item.create_time,
						};
						if (currentMsg) {
							currentMsg.noread = Number(currentMsg.noread) + 1;
							currentMsg.msg.push(msgTxt);
						} else {
							msgData.push({
								person_id: -1, // 发送信息的人
								person_name: '系统通知', // 发送信息人的名字
								noread: 1,
								msgType: item.type, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
								msg: [msgTxt],
							});
						}
					}
					// 订单推送
					if (item.type === 3) {
						// content - {demand_id, user_id} demand_id: 需求id user_id: 发布方的id
						item.content = JSON.parse(item.content);
						const currentMsg = msgData.filter((msg) => Number(msg.msgType) === item.type)[0];
						const msgTxt = {
							content: '您好，您有一份工作信息，请点击查看详情',
							from: 2, // 1-本人 2-其他人
							time: item.create_time,
							orderDetail: { demand_id: item.content.demand_id, user_id: item.content.user_id },
						};
						if (currentMsg) {
							currentMsg.noread = Number(currentMsg.noread) + 1;
							currentMsg.msg.push(msgTxt);
						} else {
							msgData.push({
								person_id: -1, // 发送信息的人
								person_name: '订单推送', // 发送信息人的名字
								noread: 1,
								msgType: item.type, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
								msg: [msgTxt],
							});
						}
					}
					// 邀请信息
					if (item.type === 4) {
						// user_id: 邀请人的信息，person_id: 被邀请人的信息，content:{team_id: 1}
						item.content = JSON.parse(item.content);
						const currentMsg = msgData.filter((msg) => Number(msg.msgType) === item.type)[0];
						const msgTxt = {
							content: '您好，您有一个乐队邀请信息，请点击查看详情',
							from: 2, // 1-本人 2-其他人
							time: item.create_time,
							teamDetail: { team_id: item.content.team_id, user_id: item.content.user_id },
						};
						if (currentMsg) {
							currentMsg.noread = Number(currentMsg.noread) + 1;
							currentMsg.msg.push(msgTxt);
						} else {
							msgData.push({
								person_id: -1, // 发送信息的人
								person_name: '邀请信息', // 发送信息人的名字
								noread: 1,
								msgType: item.type, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
								msg: [msgTxt],
							});
						}
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
			// 查询是否有未支付订单
			get({ url: '/demand/noPayDeamnds', data: { user_id } }).then((demands) => {
				if (demands && demands.num) {
					this.globalData.demandsNum = demands.num;
					this.globalData.num += Number(demands.num) || 0;
				}
				this.globalData.msgsNum = num;
				const finalTime = new Date().getTime();
				this.globalData.currentTime = finalTime;
				// console.log(START_TIME, END_TIME);
				// console.log(END_TIME - START_TIME, '相差时间');
				if (String(num) !== '0') {
					wx.showTabBarRedDot({
						index: 4,
						fail: (err) => {
							console.log(err);
						},
					});
				} else {
					wx.hideTabBarRedDot({
						index: 4,
						fail: () => {},
					});
				}
			});
		});
	},
});
