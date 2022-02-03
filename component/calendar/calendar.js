// component/calendar/calendar.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		calendar: [],
		week: ['日', '一', '二', '三', '四', '五', '六'],
		// week: ['Sun', 'Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat'],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {},

	lifetimes: {
		attached: function () {
			// 在组件实例进入页面节点树时执行
			const selectRange = [
				{
					start_time: 3,
					end_time: 10,
				},
				{
					start_time: 16,
					end_time: 17,
				},
			];
			const arr = [];
			for (let index = 1; index < 31; index++) {
				arr.push({
					day: index,
					is_start: false,
					is_end: false,
					is_ranger: false,
				});
			}
			selectRange.forEach((range) => {
				arr.forEach((item) => {
					if (item.day === range.start_time) {
						item.is_start = true;
					}
					if (item.day === range.end_time) {
						item.is_end = true;
					}
					if (item.day > range.start_time && item.day < range.end_time) {
						item.is_ranger = true;
					}
				});
			});
			this.setData({ calendar: arr });
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},
});
