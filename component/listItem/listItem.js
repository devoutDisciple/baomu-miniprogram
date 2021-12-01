// component/listItem/listItem.js
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
		iconName: {
			type: String,
			value: 'my_team',
		},
		isFirst: {
			type: Boolean,
			value: false,
		},
		isLast: {
			type: Boolean,
			value: false,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {},
});
