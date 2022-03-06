import request from '../../utils/request';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		visible: {
			type: Boolean,
			value: false,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		logoUrl: 'https://www.chiangky.com/public/logo.png',
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		getPhoneNumber: function (e) {
			const { errMsg, encryptedData, iv } = e.detail;
			if (errMsg === 'getPhoneNumber:ok') {
				wx.login({
					// 成功失败与否
					complete: async (res) => {
						if (res && res.errMsg === 'login:ok') {
							const { code } = res;
							const userid = wx.getStorageSync('user_id');
							const result = await request.post({
								url: '/wechat/phone',
								data: { encryptedData, iv, code, userid },
							});
							if (result) {
								this.triggerEvent('OnClose');
							}
							wx.setStorageSync('phone', String(result));
						} else {
							wx.showToast({
								title: '登录失败',
								icon: 'error',
							});
						}
					},
				});
			}
		},
		onClose: function () {
			this.triggerEvent('OnClose');
		},
	},
});
