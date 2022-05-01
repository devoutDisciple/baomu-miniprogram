import request from '../../utils/request';
import { schools, levels } from '../../constant/constant';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		idx: {
			type: String || Number,
			value: '',
		},
		userid: {
			type: String || Number,
			value: '',
		},
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
				id: 1,
			},
			{
				title: '毕业院校认证标识',
				src: '/asserts/public/yuanxiaorenzheng.png',
				desc: '有此标识的用户通过平台审核身份真实有效',
				icon: '/asserts/public/yuanxiao.png',
				class: 'msg_tubiao_item_yuanxiao',
				name: '院校',
				id: 2,
			},
			{
				title: '荣获奖项认证标识',
				src: '/asserts/public/huojiangrenzheng.png',
				desc: '此用户在xx届钢琴比赛中荣获1等级',
				icon: '/asserts/public/huojiang.png',
				class: 'msg_tubiao_item_huojiang',
				name: '获奖',
				id: 3,
			},
			{
				title: '专业考级认证标识',
				src: '/asserts/public/kaojirenzheng.png',
				desc: '此用户钢琴考级已过8级',
				icon: '/asserts/public/kaoji.png',
				class: 'msg_tubiao_item_kaoji',
				name: '考级',
				id: 4,
			},
			{
				title: '专业设备认证标识',
				src: '/asserts/public/renzhengshebei.png',
				desc: '有此标识的用户通过平台审核设备真实有效',
				icon: '/asserts/public/device.png',
				class: 'msg_tubiao_item_device',
				name: '专业设备认证',
				id: 5,
			},
		],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击标识
		onTapSign: async function () {
			const { dialogDetail, userid } = this.data;
			// 实名认证
			if (dialogDetail.id === 1) {
				this.setData({ dialogShow: true });
			}
			// 毕业院校认证标识
			if (dialogDetail.id === 2) {
				const result = await request.get({ url: '/school/all', data: { user_id: userid } });
				dialogDetail.desc = `此用户毕业院校 ${result.school_name || ''} 已通过认证`;
				this.setData({ dialogDetail, dialogShow: true });
			}
			// 荣获奖项认证标识
			if (dialogDetail.id === 3) {
				const result = await request.get({ url: '/school/all', data: { user_id: userid } });
				dialogDetail.desc = `此用户于 ${result.certificate_time} 获得 ${
					result.certificate_name || ''
				}证书 已通过认证`;
				this.setData({ dialogDetail, dialogShow: true });
			}
			// 专业考级认证标识
			if (dialogDetail.id === 4) {
				const result = await request.get({ url: '/level/all', data: { user_id: userid } });
				const { name: school_name } = schools.filter((item) => item.id === result.school_id)[0];
				const { name: level_name } = levels.filter((item) => item.id === result.school_id)[0];
				dialogDetail.desc = `此用户已获得 由${school_name}颁发${level_name}证书 已通过认证`;
				this.setData({ dialogDetail, dialogShow: true });
			}
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
