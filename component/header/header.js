import deviceUtil from '../../utils/deviceUtil';

Component({
	options: {
		// isolated 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响（一般情况下的默认值）；
		styleIsolation: 'isolated',
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		text: {
			type: String,
			value: '',
		},
		showBack: {
			type: Boolean,
			value: false,
		},
		showTop: {
			type: Boolean,
			value: false,
		},
		topColor: {
			type: String,
			value: '',
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		navHeight: '40px',
		statusBarHeight: '20px',
		backIconMarginTop: '10px',
		headerHight: '60px',
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 获取设备信息
		getDeviceData: function () {
			// 获取设备信息
			deviceUtil.getDeviceInfo().then((res) => {
				this.setData({
					headerHight: `${res.headerHight}px`,
					navHeight: `${res.navHeight}px`,
					statusBarHeight: `${res.statusBarHeight}px`,
					backIconMarginTop: `${res.navHeight / 3}px`,
				});
			});
		},
		// 点击返回
		onTapBack: function () {
			wx.navigateBack({
				complete: (res) => {},
			});
		},
	},

	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		// 组件生命周期函数-在组件实例进入页面节点树时执行)
		attached: function () {
			this.getDeviceData();
		},
		moved: function () {},
		// 组件生命周期函数-在组件实例被从页面节点树移除时执行)
		detached: function () {},
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function () {},
		hide: function () {},
		resize: function () {},
	},
});
