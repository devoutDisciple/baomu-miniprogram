Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		msg: {
			type: Object,
			value: {},
		},
		personId: {
			type: String,
			value: '',
		},
		msgData: {
			type: Array,
			value: [],
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	lifetimes: {
		attached: function () {},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击消息
		onTapMsg: function (e) {
			const { msgtype } = e.currentTarget.dataset;

			const { msg, msgData, personId } = this.data;
			let num = 0;
			// // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
			if (!msgtype || msgtype === 1) {
				msgData.forEach((item) => {
					if (String(item.person_id) === String(personId)) {
						num = item.noread;
						item.noread = 0;
					}
				});
			}
			if (msgtype === 2 || msgtype === 3 || msgtype === 4) {
				msgData.forEach((item) => {
					if (String(item.msgType) === String(msgtype)) {
						num = item.noread;
						item.noread = 0;
					}
				});
			}
			const totalNum = Number(getApp().globalData.msgsNum) - Number(num);
			getApp().globalData.msgsNum = totalNum;
			wx.setStorageSync('msg_data', JSON.stringify(msgData));
			if (msgtype === 1) {
				wx.navigateTo({
					url: `/pages/chat/chat?person_id=${msg.person_id}`,
				});
			}
			if (msgtype === 2 || msgtype === 3 || msgtype === 4) {
				wx.navigateTo({
					url: `/pages/message/systemMsg/systemMsg?type=${msgtype}`,
				});
			}
		},
	},
});
