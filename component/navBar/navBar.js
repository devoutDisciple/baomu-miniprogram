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
		headerHight: '60px', // 导航总高度
		statusHeight: '20px', // 状态栏高度
		navHeight: '40px', // 内容高度
		conHegiht: 32, // 内容区要展示内容的高度
		disWidth: 101, // 按钮占用的宽度
		paddingLeft: 7, // 左边留白宽度
		paddingTop: 4, // 上方留白高度
	},

	methods: {
		// 获取设备信息
		getDeviceData: function () {
			// 获取设备信息
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
					headerHight: `${headerHight}px`,
					navHeight: `${navHeight}px`,
					statusBarHeight: `${statusHeight}px`,
					backIconMarginTop: `${navHeight / 3}px`,
					statusHeight: `${statusHeight}px`,
					conHegiht: conHegiht - 2,
					disWidth,
					paddingLeft,
					paddingTop,
				});
			});
		},
		// 输入确定
		onConfirm: function (e) {
			let { value } = e.detail;
			value = String(value).trim();
			this.triggerEvent('OnSearch', { value });
		},
	},

	// 组件生命周期函数-在组件实例进入页面节点树时执行)
	attached() {
		this.getDeviceData();
	},
});
