// component/homeSelectSearch/homeSelectSearch.js
import { PLAYS_STYLE, TEAM_TYPE, person_style, instruments, voices } from '../../constant/constant';

Component({
	// address_select: '', // 选择的地址
	// team_type_id: '', // 乐团类型
	// team_type_name: '', // 乐团类型
	// person_style_id: '', // 擅长风格
	// person_style_name: '', // 擅长风格
	// plays_style_id: '', // 演奏方式
	// plays_style_name: '', // 演奏方式
	// instruments_type_select_id: '', // 乐器id
	// instruments_type_select_name: '', // 乐器名称

	/**
	 * 组件的属性列表
	 */
	properties: {
		type: {
			type: Number,
			value: 1, // 1-查询演员 2-查询需求
		},
		address_select: {
			type: String,
			value: '城市',
		},
		team_type_select_id: {
			type: String,
			value: '',
		},
		team_type_select_name: {
			type: String,
			value: '',
		},
		person_style_selecg_id: {
			type: String,
			value: '',
		},
		person_style_selecg_name: {
			type: String,
			value: '',
		},
		plays_style_select_id: {
			type: String,
			value: '',
		},
		plays_style_select_name: {
			type: String,
			value: '',
		},
		instruments_type_select_id: {
			type: String,
			value: '',
		},
		instruments_type_select_name: {
			type: String,
			value: '',
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		// 筛选选项
		TEAM_TYPE: TEAM_TYPE, // 乐团类型
		team_type_select_id: '', // 选择的乐团类型的id
		team_type_select_name: '', // 选择的乐团类型的name
		person_style: person_style, // 擅长风格
		person_style_selecg_id: '', // 选择的擅长风格的id
		person_style_selecg_name: '', // 选择的擅长风格的name
		PLAYS_STYLE: PLAYS_STYLE, // 演奏方式
		plays_style_select_id: '', // 选择的演奏方式的id
		plays_style_select_name: '', // 选择的演奏方式的name
		INSTRUMENTS_TYPE: [...instruments, ...voices], // 乐器类型
		instruments_type_select_id: '', // 选择的演奏方式的id
		instruments_type_select_name: '', // 选择的演奏方式的name
	},

	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () {},
		moved: function () {},
		detached: function () {},
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function () {},
		hide: function () {},
		resize: function () {},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击筛选选项
		goToSearchPage: function () {
			const { type } = this.data;
			wx.navigateTo({
				url: `/pages/home/condition/condition?type=${type}`,
			});
		},

		triggerCallback: function () {
			const {
				address_select,
				team_type_select_id: team_type_id,
				person_style_selecg_id: person_style_id,
				plays_style_select_id: plays_style_id,
			} = this.data;
			this.triggerEvent('OnChange', { address_select, team_type_id, person_style_id, plays_style_id });
		},

		// 选择
		onSelectPlay: function (e) {
			const { INSTRUMENTS_TYPE } = this.data;
			const { value } = e.detail;
			const { key } = e.currentTarget.dataset;
			if (key === 'address') {
				this.setData({ address_select: value[1] || value[0] }, this.triggerCallback);
			}
			if (key === 'team_type') {
				const selectItem = TEAM_TYPE[value];
				this.setData(
					{ team_type_select_id: selectItem.id, team_type_select_name: selectItem.name },
					this.triggerCallback,
				);
			}
			if (key === 'person_style') {
				const selectItem = person_style[value];
				this.setData(
					{ person_style_selecg_id: selectItem.id, person_style_selecg_name: selectItem.name },
					this.triggerCallback,
				);
			}
			if (key === 'plays_style') {
				const selectItem = PLAYS_STYLE[value];
				this.setData(
					{ plays_style_select_id: selectItem.id, plays_style_select_name: selectItem.name },
					this.triggerCallback,
				);
			}
			if (key === 'instruments_type') {
				const selectItem = INSTRUMENTS_TYPE[value];
				this.setData(
					{ instruments_type_select_id: selectItem.id, instruments_type_select_name: selectItem.name },
					this.triggerCallback,
				);
			}
		},

		// 点击取消筛选
		onCancleTap: function () {
			this.setData(
				{
					team_type_select_id: '', // 选择的乐团类型的id
					team_type_select_name: '', // 选择的乐团类型的name
					person_style_selecg_id: '', // 选择的擅长风格的id
					person_style_selecg_name: '', // 选择的擅长风格的name
					plays_style_select_id: '', // 选择的演奏方式的id
					plays_style_select_name: '', // 选择的演奏方式的name
					instruments_type_select_id: '', // 选择的演奏方式的id
					instruments_type_select_name: '', // 选择的演奏方式的name
				},
				this.triggerCallback,
			);
		},
	},
});
