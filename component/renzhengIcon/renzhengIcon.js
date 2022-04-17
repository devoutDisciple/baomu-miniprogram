// component/renzhengIcon/renzhengIcon.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		idx: '',
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		dialogDetail: {},
		dialogShow: false,
		dialogList: [
			{
				title: '实名认证标识',
				src: '/asserts/public/renzhengbiaoshi.png',
				desc: '有此标识的用户通过平台审核身份真实有效',
				icon: '/asserts/public/renzheng.png',
				class: 'msg_tubiao_item_renzheng',
				name: '实名',
			},
			{
				title: '毕业院校认证标识',
				src: '/asserts/public/yuanxiaorenzheng.png',
				desc: '有此标识的用户通过平台审核身份真实有效',
				icon: '/asserts/public/yuanxiao.png',
				class: 'msg_tubiao_item_yuanxiao',
				name: '院校',
			},
			{
				title: '荣获奖项认证标识',
				src: '/asserts/public/huojiangrenzheng.png',
				desc: '此用户在xx届钢琴比赛中荣获1等级',
				icon: '/asserts/public/huojiang.png',
				class: 'msg_tubiao_item_huojiang',
				name: '获奖',
			},
			{
				title: '专业考级认证标识',
				src: '/asserts/public/kaojirenzheng.png',
				desc: '此用户钢琴考级已过8级',
				icon: '/asserts/public/kaoji.png',
				class: 'msg_tubiao_item_kaoji',
				name: '考级',
			},
			{
				title: '专业设备认证标识',
				src: '/asserts/public/renzhengshebei.png',
				desc: '有此标识的用户通过平台审核设备真实有效',
				icon: '/asserts/public/device.png',
				class: 'msg_tubiao_item_device',
				name: '专业设备认证',
			},
		],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击标识
		onTapSign: function () {
			this.setData({ dialogShow: true });
		},

		// 点击关闭弹框
		onCloseDialog: function () {
			this.setData({ dialogShow: false });
		},
	},

	observers: {
		idx: function (idx) {
			const dialogDetail = this.data.dialogList[idx - 1];
			this.setData({ dialogDetail });
		},
	},
});
