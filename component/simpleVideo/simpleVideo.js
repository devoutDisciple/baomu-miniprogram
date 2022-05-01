Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		videoDetail: {
			type: Object,
			value: {},
		},
		videoId: {
			type: String,
			value: '',
		},
		// 是否显示视频封面，上传视频时候不显示
		showCoverImg: {
			type: Boolean,
			value: true,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		activeState: 'waiting', // waiting-视频还没有播放 process-视频播放中 pause-视频暂停 end-视频播放结束
		hasPlay: false, // 是否已经播放过
		controllerShow: false, // 控制条显示隐藏
		videoContext: {}, // 当前视频上下文
		curVideoDetail: {},
	},

	observers: {
		videoDetail: function () {},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击视频，控制视频播放和结束
		onTapModalImg: function () {
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			// 将当前播放的视频上下文保存在当前页面，以确保当前只有一个视频在播放
			const { videoContext: pageVideoContext } = currentPage.data;
			const { activeState, videoId } = this.data;
			if (!videoId) return;
			// 组件中必须用this
			const videoContext = wx.createVideoContext(videoId, this);
			this.videoContext = videoContext;
			// 停止上一个视频
			if (pageVideoContext && pageVideoContext.pause) {
				pageVideoContext.pause();
			}

			if (activeState === 'process') {
				videoContext.pause();
			} else {
				videoContext.play();
			}
			// 替换当前视频上下文
			currentPage.setData({ videoContext });
		},
		// 点击暂停按钮
		onTapPauseBtn: function () {
			this.videoContext.pause();
		},
		// 点击开始播放按钮
		onTapStartBtn: function () {
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			// 将当前播放的视频上下文保存在当前页面，以确保当前只有一个视频在播放
			const { videoContext: pageVideoContext } = currentPage.data;
			if (pageVideoContext !== this.videoContext) {
				pageVideoContext.pause();
			}
			this.videoContext.play();
		},
		// 切换controller显示隐藏时触发
		onControlStoggle: function (e) {
			const { show } = e.detail;
			this.setData({ controllerShow: show });
		},
		// 视频播放进度改变
		onTimeUpdate: function () {
			const { windowHeight } = wx.getSystemInfoSync();
			const self = this;
			wx.createSelectorQuery()
				.in(this)
				.select(`#${this.data.videoId}`)
				.boundingClientRect(function (rect) {
					if (!rect) return;
					// 查看是否超出可视区域，然后停止播放
					const { top } = rect;
					if (top < -30 || top > windowHeight) {
						self.videoContext.pause();
					}
				})
				.exec();
		},
		// 当视频开始的时候
		onVideoPlay: function () {
			this.setData({ activeState: 'process' });
		},
		// 视频暂停的时候
		onVideoPause: function () {
			this.setData({ activeState: 'pause' });
		},
		// 视频播放结束时候
		onVideoEnd: function () {
			this.setData({ activeState: 'end' });
		},
		videoErrorCallback: function (e) {
			console.log('视频错误信息:');
			console.log(e.detail.errMsg);
		},
	},

	lifetimes: {
		attached: function () {},
	},
});
