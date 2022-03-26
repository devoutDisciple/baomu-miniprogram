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
		attached: function () {
			console.log(this.data);
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击消息
		onTapMsg: function (e) {
			const { msgtype } = e.currentTarget.dataset;
			// 个人信息
			if (!msgtype) {
				const { msg, msgData, personId } = this.data;
				let num = 0;
				msgData.forEach((item) => {
					if (String(item.person_id) === String(personId)) {
						num = item.noread;
						item.noread = 0;
					}
				});
				const totalNum = Number(getApp().globalData.msgsNum) - Number(num);
				getApp().globalData.msgsNum = totalNum;
				wx.setStorageSync('msg_data', JSON.stringify(msgData));
				wx.navigateTo({
					url: `/pages/chat/chat?person_id=${msg.person_id}`,
				});
			}
			// 系统通知
			if (msgtype === 2) {
				wx.navigateTo({
					url: '/pages/systemMsg/systemMsg',
				});
			}
			// 系统通知
			if (msgtype === 3) {
				wx.navigateTo({
					url: '/pages/systemMsg/systemMsg',
				});
			}
			// 系统通知
			if (msgtype === 4) {
				wx.navigateTo({
					url: '/pages/systemMsg/systemMsg',
				});
			}
		},
	},
});
