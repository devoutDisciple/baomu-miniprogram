import util from '../../utils/util';

const app = getApp();
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		type: {
			type: String,
			value: '',
		},
		num: {
			type: String,
			value: '',
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
		// 点击点赞或评论
		onTapItem: function (e) {
			const { type } = e.currentTarget.dataset;
			const now = util.formatTime(new Date());
			if (type === 'goods') {
				wx.setStorageSync('search_goods_time', now);
				app.globalData.myReceiveGoodsNum = 0;
			}
			if (type === 'comment') {
				wx.setStorageSync('search_comment_time', now);
				app.globalData.myReceiveCommentsNum = 0;
			}
			const totalNum =
				Number(getApp().globalData.myReceiveGoodsNum) +
				Number(getApp().globalData.myReceiveCommentsNum) +
				Number(getApp().globalData.msgsNum);
			if (totalNum) {
				wx.showTabBarRedDot({
					index: 2,
					text: String(totalNum),
				});
			} else {
				wx.hideTabBarRedDot({
					index: 2,
				});
			}
			if (type === 'goods') {
				wx.navigateTo({
					url: '/pages/goodsRecord/goodsRecord',
				});
			} else {
				wx.navigateTo({
					url: '/pages/commendRecord/commendRecord',
				});
			}
		},
	},
});
