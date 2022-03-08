// component/calendar/calendar.js
// eslint-disable-next-line import/named
import { getDays } from '../../utils/util';
import moment from '../../utils/moment.min';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		selectTimeRange: {
			type: Array,
			value: [],
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		calendar: [],
		week: ['日', '一', '二', '三', '四', '五', '六'],
		year: 2022,
		month: '02',
		// week: ['Sun', 'Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat'],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		renderDom: function (year, month) {
			let totalDays = getDays(year, month);
			const week = moment(`${year}-${month}-01`).day();
			totalDays += week;
			const { selectTimeRange } = this.data;
			const result = [];
			for (let index = 1; index <= totalDays; index++) {
				const obj = {
					day: index,
					is_start: false,
					is_end: false,
					is_ranger: false,
					is_empty: false,
					is_along: false,
				};
				if (index <= week) {
					obj.is_empty = true;
				} else {
					obj.is_empty = false;
					obj.day = index - week;
					obj.time = moment(`${year}-${month}-${index - week}`).format('YYYY-MM-DD');
				}
				result.push(obj);
			}
			if (selectTimeRange && selectTimeRange.length !== 0) {
				selectTimeRange.forEach((range) => {
					result.forEach((item) => {
						if (range.start_time === range.end_time && range.start_time === item.time) {
							item.is_along = true;
							return;
						}
						if (item.time === range.start_time) {
							item.is_start = true;
						}
						if (item.time === range.end_time) {
							item.is_end = true;
						}
						if (
							item.time &&
							moment(item.time).isAfter(range.start_time) &&
							moment(item.time).isBefore(range.end_time)
						) {
							item.is_ranger = true;
						}
					});
				});
			}
			this.setData({ calendar: result, year, month });
		},
		// 点击上一个月
		onTapPreMonth: function () {
			const { year, month } = this.data;
			const date = moment(`${year}-${month}`).subtract(1, 'months').format('YYYY-MM');
			const newYear = moment(date).format('YYYY');
			const newMonth = moment(date).format('MM');
			this.renderDom(newYear, newMonth);
		},
		// 点击下一个月
		onTapNextMonth: function () {
			const { year, month } = this.data;
			const date = moment(`${year}-${month}`).add(1, 'months').format('YYYY-MM');
			const newYear = moment(date).format('YYYY');
			const newMonth = moment(date).format('MM');
			this.renderDom(newYear, newMonth);
		},
	},

	lifetimes: {
		attached: function () {
			// 在组件实例进入页面节点树时执行
			const year = moment(new Date()).format('YYYY');
			const month = moment(new Date()).format('MM');
			this.renderDom(year, month);
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},
});
