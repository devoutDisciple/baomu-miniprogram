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

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击消息
		onTapMsg: function () {
			const { msg, msgData, personId } = this.data;
			let num = 0;
			msgData.forEach((item) => {
				if (String(item.person_id) === String(personId)) {
					num = item.noread;
					item.noread = 0;
				}
			});
			const totalNum =
				Number(getApp().globalData.myReceiveGoodsNum) +
				Number(getApp().globalData.myReceiveCommentsNum) +
				Number(getApp().globalData.msgsNum) -
				Number(num);
			if (totalNum) {
				wx.setTabBarBadge({
					index: 2,
					text: String(totalNum),
				});
			} else {
				wx.removeTabBarBadge({
					index: 2,
				});
			}
			wx.setStorageSync('msg_data', JSON.stringify(msgData));
			wx.navigateTo({
				url: `/pages/message/chat/chat?person_id=${msg.person_id}`,
			});
		},
	},
});
