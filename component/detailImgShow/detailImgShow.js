Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		imgList: {
			type: Array,
			value: [],
		},
		showAll: {
			type: Boolean,
			value: false,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		imgLists: [],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		showImg: function (e) {
			const { index } = e.currentTarget.dataset;
			const { imgList } = this.data;
			const urls = [];
			imgList.forEach((item) => {
				if (item) urls.push(item);
			});
			wx.previewImage({ urls, current: urls[index], showmenu: true });
		},
	},

	/**
	 * 生命周期
	 */
	lifetimes: {
		attached: function () {},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	observers: {
		imgList: function (imgList) {
			if (Array.isArray(imgList) && imgList.length > 2) {
				const len = imgList.length;
				const remain = len % 3;
				if (remain === 1) {
					const newImgList = imgList.concat(['', '']);
					return this.setData({ imgLists: newImgList, imgListLen: imgList.length });
				}
				if (remain === 2) {
					const newImgList = imgList.concat(['']);
					return this.setData({ imgLists: newImgList, imgListLen: imgList.length });
				}
			}
			this.setData({ imgLists: imgList, imgListLen: imgList.length });
		},
	},
});
