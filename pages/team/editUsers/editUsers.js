import request from '../../../utils/request';
import loadding from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		teamUserDetail: '', // 用户信息
		team_user_id: '', // 用户在团队中的id
		job_name: '', // 乐队担当名称
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
	},

	// 查询用户信息
	onSearchUserDetail: async function () {
		loadding.showLoading();
		const { team_user_id } = this.data;
		const teamUserDetail = await request.get({ url: '/team/userDetailByTeamUserId', data: { team_user_id } });
		this.setData({ teamUserDetail });
		if (teamUserDetail.type) {
			this.setData({ job_name: teamUserDetail.type });
		}
		loadding.hideLoading();
	},

	// 输入框失焦点
	onBlurIpt: function (e) {
		const { value } = e.detail;
		this.setData({ job_name: String(value).trim() });
	},

	// 保存
	onTapSave: async function () {
		const self = this;
		setTimeout(async () => {
			loadding.showLoading();
			const { team_user_id } = self.data;
			const { job_name } = self.data;
			await request.post({
				url: '/team/updateUserDetailByTeamUserId',
				data: { team_user_id, job_name: job_name },
			});
			wx.showToast({
				title: '修改成功',
			});
			loadding.hideLoading();
		}, 500);
	},
});
