// pages/home/condition/condition.js
import { TEAM_TYPE, PLAYS_STYLE, person_style } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		type: 1, // 1-查询演员 2-查询演出
		TEAM_TYPE: TEAM_TYPE, // 团队类型
		PLAYS_STYLE: PLAYS_STYLE, // 表演类型
		person_style: person_style, // 擅长风格
		address_select: '',
		team_type_select_id: '', // 选择的乐团类型的id
		team_type_select_name: '', // 选择的乐团类型的name
		plays_style_select_id: '', // 选择的表演类型的id
		plays_style_select_name: '', // 选择的表演类型的name
		person_style_selecg_id: '', // 选择的擅长风格的id
		person_style_selecg_name: '', // 选择的擅长风格的name
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { type } = options;
		this.setData({ type: Number(type) });
	},

	// 点击乐团类型
	onTapSelectItem: function (e) {
		const { team_type_select_id, plays_style_select_id, person_style_selecg_id } = this.data;
		const { item, key } = e.currentTarget.dataset;
		if (key === 'address') {
			const { value } = e.detail;
			this.setData({ address: value[1] || value[0] });
		}
		if (key === 'team_type') {
			const is_cancled = team_type_select_id === item.id;
			this.setData({
				team_type_select_id: is_cancled ? '' : item.id,
				team_type_select_name: is_cancled ? '' : item.name,
			});
		}
		if (key === 'plays_style') {
			const is_cancled = plays_style_select_id === item.id;
			this.setData({
				plays_style_select_id: is_cancled ? '' : item.id,
				plays_style_select_name: is_cancled ? '' : item.name,
			});
		}
		if (key === 'person_style') {
			const is_cancled = person_style_selecg_id === item.id;
			this.setData({
				person_style_selecg_id: is_cancled ? '' : item.id,
				person_style_selecg_name: is_cancled ? '' : item.name,
			});
		}
	},

	// 点击确定
	onTapSure: function () {
		// team_type_select_id: '', // 选择的乐团类型的id
		// team_type_select_name: '', // 选择的乐团类型的name
		// plays_style_select_id: '', // 选择的表演类型的id
		// plays_style_select_name: '', // 选择的表演类型的name
		// person_style_selecg_id: '', // 选择的擅长风格的id
		// person_style_selecg_name: '', // 选择的擅长风格的name
		const {
			address,
			team_type_select_id,
			team_type_select_name,
			plays_style_select_id,
			plays_style_select_name,
			person_style_selecg_id,
			person_style_selecg_name,
		} = this.data;
		const pages = getCurrentPages();
		const prePage = pages[pages.length - 2];
		if (prePage.route === 'pages/home/index/index') {
			// address_select: '', // 选择的地址
			// team_type_id: '', // 乐团类型
			// team_type_name: '', // 乐团类型
			// person_style_id: '', // 擅长风格
			// person_style_name: '', // 擅长风格
			// plays_style_id: '', // 表演类型
			// plays_style_name: '', // 表演类型
			prePage.setData(
				{
					address_select: address && address !== 'undefined' ? address : '', // 选择的地址
					team_type_id: team_type_select_id, // 乐团类型
					team_type_name: team_type_select_name,
					person_style_id: person_style_selecg_id, // 擅长风格
					person_style_name: person_style_selecg_name,
					plays_style_id: plays_style_select_id, // 表演类型
					plays_style_name: plays_style_select_name,
				},
				() => {
					prePage.onSearch();
				},
			);
			wx.navigateBack();
		}
	},
});
