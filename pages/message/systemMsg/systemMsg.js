Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		type: 2, // 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
		msg: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let { type } = options;
		type = Number(type);
		this.setData({ type: type });
		// 1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息
		if (type === 2) {
			wx.setNavigationBarTitle({
				title: '系统通知',
			});
		}
		if (type === 3) {
			wx.setNavigationBarTitle({
				title: '订单推送',
			});
		}
		if (type === 4) {
			wx.setNavigationBarTitle({
				title: '邀请信息',
			});
		}
		let msgData = wx.getStorageSync('msg_data');
		msgData = JSON.parse(msgData);
		const systemMsg = msgData.filter((item) => item.msgType === type)[0];
		console.log(systemMsg, 111);
		this.setData({ msg: systemMsg.msg || [] });
	},

	// 点击邀请信息
	onTapTeamInvitation: function (e) {
		const { item } = e.currentTarget.dataset;
		const { teamDetail } = item;
		console.log(item, 111);
		wx.navigateTo({
			url: `/pages/team/accept/accept?team_id=${teamDetail.team_id}`,
		});
	},
});
