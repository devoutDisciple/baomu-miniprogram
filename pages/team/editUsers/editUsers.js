// pages/team/editUsers/editUsers.js
import { TEAM_USER_SKILL } from '../../../constant/constant';
import request from '../../../utils/request';
import loadding from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		teamUserDetail: '', // 用户信息
		team_user_id: '', // 用户在团队中的id
		study_list: [], // 乐队担当
		study_id: '', // 乐队担当id
		study_name: '', // 乐队担当名称
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { team_user_id } = options;
		if (!team_user_id) {
			return wx.navigateBack();
		}
		this.setData({ team_user_id }, () => {
			this.onSearchUserDetail();
		});
		// 获取队员乐队担当下拉选项
		this.getStudyType();
	},

	// 查询用户信息
	onSearchUserDetail: async function () {
		loadding.showLoading();
		const { team_user_id } = this.data;
		const teamUserDetail = await request.get({ url: '/team/userDetailByTeamUserId', data: { team_user_id } });
		const NEW_TEAM_USER_SKILL = [{ id: -1, name: '未知' }, ...TEAM_USER_SKILL];
		const { id: study_id, name: study_name } = NEW_TEAM_USER_SKILL.filter(
			(item) => item.id === teamUserDetail.type,
		)[0];
		this.setData({ teamUserDetail, study_id, study_name });
		loadding.hideLoading();
	},

	// 获取队员乐队担当下拉选项
	getStudyType: function () {
		const study_list = [];
		TEAM_USER_SKILL.forEach((item) => study_list.push(item.name));
		this.setData({ study_list: study_list });
	},

	// 选择乐队担当
	onPickStudy: async function (e) {
		loadding.showLoading();
		const { team_user_id } = this.data;
		const { value } = e.detail;
		const selectItem = TEAM_USER_SKILL[value];
		this.setData({ study_id: selectItem.id, study_name: selectItem.name });
		await request.post({ url: '/team/updateUserDetailByTeamUserId', data: { team_user_id, type: selectItem.id } });
		wx.showToast({
			title: '修改成功',
		});
		loadding.hideLoading();
	},
});
