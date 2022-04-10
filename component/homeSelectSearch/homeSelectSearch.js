// component/homeSelectSearch/homeSelectSearch.js
import { PLAYS_STYLE, TEAM_TYPE, person_style } from '../../constant/constant';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		// 筛选选项
		address: '',
		TEAM_TYPE: TEAM_TYPE, // 乐团类型
		team_type_select_id: '', // 选择的乐团类型的id
		team_type_select_name: '', // 选择的乐团类型的name
		person_style: person_style, // 擅长风格
		person_style_selecg_id: '', // 选择的擅长风格的id
		person_style_selecg_name: '', // 选择的擅长风格的name
		PLAYS_STYLE: PLAYS_STYLE, // 演奏方式
		plays_style_select_id: '', // 选择的演奏方式的id
		plays_style_select_name: '', // 选择的演奏方式的name
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
			wx.navigateTo({
				url: '/pages/home/condition/condition',
			});
		},

		// 选择
		onSelectPlay: function (e) {
			console.log(e, 232);
		},
	},
});
