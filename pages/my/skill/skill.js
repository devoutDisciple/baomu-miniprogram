import util from '../../../utils/util';
import { skills } from '../../../constant/constant';
import request from '../../../utils/request';
import loading from '../../../utils/loading';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		idcard1: '', // 身份证正面
		idcard2: '', // 反面
		type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
		dialogShow: false,
		skillList: [], // 用户的技能列表
		dialogDetail: {
			title: '已保存!',
			src: '/asserts/public/publish.png',
			desc: '',
		},
		// addList: [{ id: 'id',  selectSkillName: '', selectGradeId: '', selectGradeName: '' }], // 添加技能的id的list
		addList: [], // 添加技能的id的list
		gradeList: [1, 2, 3, 4, 5], // 自评分
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function () {
		// 获取技能列表
		await this.getSkillList();
	},

	// 获取用户技能
	getSkillList: async function () {
		const user_id = wx.getStorageSync('user_id');
		if (!user_id) return;
		loading.showLoading();
		const lists = await request.get({ url: '/skill/all', data: { user_id } });
		lists.forEach((item) => {
			item.grade = Number(item.grade).toFixed(1);
			item.percent = Number((Number(item.grade) / 5) * 100).toFixed(0);
		});
		this.setData({ skillList: lists });
		loading.hideLoading();
	},

	// 提交审核
	onSend: async function () {
		const { addList } = this.data;
		const user_id = wx.getStorageSync('user_id');
		if (!addList || addList.length === 0) {
			return wx.showToast({
				title: '请填写技能',
				icon: 'error',
			});
		}
		let flag = true;
		const params = [];
		addList.forEach((item) => {
			if (!item.selectSkillName || !item.selectGradeId) flag = false;
			params.push({
				user_id,
				skill_name: item.selectSkillName,
				grade: item.selectGradeId,
			});
		});
		if (!flag) {
			return wx.showToast({
				title: '请完善信息',
				icon: 'error',
			});
		}
		const result = await request.post({ url: '/skill/add', data: { data: params } });
		if (result === 'success') {
			this.getSkillList();
			this.setData({ dialogShow: true, addList: [] });
		}
	},

	// 关闭弹框
	onCloseDialog: function () {
		this.setData({ dialogShow: false });
		wx.navigateBack({});
	},

	// 点击添加技能
	onAddSkill: function () {
		const { addList } = this.data;
		const randomStr = util.getRandomStr();
		addList.push({ id: randomStr, selectSkillName: '', selectGradeId: '', selectGradeName: '' });
		this.setData({ addList: addList });
	},

	// 删除已有技能
	onDeleteSkill: async function (e) {
		const { idx } = e.currentTarget.dataset;
		const user_id = wx.getStorageSync('user_id');
		const { skillList } = this.data;
		console.log(skillList, 2222);
		const currentItem = skillList[idx];
		const result = await request.post({ url: '/skill/delete', data: { skill_id: currentItem.id, user_id } });
		if (result === 'success') {
			wx.showToast({
				title: '已删除',
				icon: 'success',
			});
			this.getSkillList();
		}
	},

	// 删除新增的技能
	onDeleteNewSkill: function (e) {
		const { id } = e.currentTarget.dataset.item;
		const { addList } = this.data;
		let idx = 0;
		addList.forEach((item, index) => {
			if (item.id === id) idx = index;
		});
		addList.splice(idx, 1);
		this.setData({ addList: addList });
	},

	// 输入技能
	onInputSkill: function (e) {
		const { value } = e.detail;
		const { idx } = e.currentTarget.dataset;
		const { addList } = this.data;
		addList[idx] = { ...addList[idx], selectSkillName: value };
		this.setData({ addList });
	},

	// 选择评分
	onPickGrade: function (e) {
		const { value } = e.detail;
		const { idx } = e.currentTarget.dataset;
		const { addList } = this.data;
		addList[idx] = { ...addList[idx], selectGradeName: Number(value) + 1, selectGradeId: Number(value) + 1 };
		this.setData({ addList });
	},
});
