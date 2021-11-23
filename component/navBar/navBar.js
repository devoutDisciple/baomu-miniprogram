import utils from '../../utils/deviceUtil';

Component({
	properties: {
		/**
		 * 自定义返回事件处理
		 */
		// customBackReturn: {
		// 	type: Boolean,
		// 	value: false,
		// },
		showBack: {
			type: Boolean,
			value: false,
		},
	},
	data: {
		headerHight: 60, // 导航总高度
		statusHeight: 20, // 状态栏高度
		navHeight: 40, // 内容高度
		conHegiht: 32, // 内容区要展示内容的高度
		disWidth: 101, // 按钮占用的宽度
		paddingLeft: 7, // 左边留白宽度
		paddingTop: 4, // 上方留白高度
		value: '', // 输入框的值
	},

	methods: {
		// input输入改变
		onChange: function (e) {
			const { value } = e.detail;
			this.setData({ value });
			this.triggerEvent('OnChange', { value });
		},
		// 输入确定
		onConfirm: function () {
			this.triggerEvent('OnConfirm');
		},
		// 点击输入框
		onTapIpt: function () {
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			if (currentPage.route !== 'pages/search/search') {
				wx.navigateTo({
					url: '/pages/search/search',
				});
			}
		},

		// 返回
		onGoback: function () {
			wx.navigateBack({
				complete: () => {},
			});
		},
	},

	// 组件生命周期函数-在组件实例进入页面节点树时执行)
	attached() {
		// 获取设备相关信息
		utils.getDeviceInfo().then((res) => {
			const {
				headerHight,
				statusBarHeight: statusHeight,
				navHeight,
				conHegiht,
				disWidth,
				paddingLeft,
				paddingTop,
			} = res;
			this.setData({
				headerHight,
				statusHeight,
				navHeight,
				conHegiht: conHegiht - 2,
				disWidth,
				paddingLeft,
				paddingTop,
			});
		});
	},
});
