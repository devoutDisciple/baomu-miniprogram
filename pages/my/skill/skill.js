import util from '../../../utils/util';
import { skills } from '../../../constant/constant';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		idcard1: '', // 身份证正面
		idcard2: '', // 反面
		type: 1, // 1-未认证 2-认证中 3-认证失败 4-认证成功
		dialogShow: false,
		dialogDetail: {
			title: '已提交审核!',
			src: '/asserts/public/publish.png',
			desc: '提交后需1-3个工作日审核，请耐心等待！',
		},
		addList: [{ id: '1111', selectSkillId: '', selectSkillName: '', selectGradeId: '', selectGradeName: '' }], // 添加技能的id的list
		skillList: [], // 技能的名称
		gradeList: [1, 2, 3, 4, 5], // 自评分
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getSkillList();
	},

	getSkillList: function () {
		const skillList = [];
		skills.forEach((item) => skillList.push(item.name));
		this.setData({ skillList });
	},

	// 选择照片
	onChooseImg: function (e) {
		const { type } = e.currentTarget.dataset;
		const self = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				const { tempFilePaths } = res;
				if (Number(type) === 1) {
					self.setData({ idcard1: tempFilePaths[0] });
				} else {
					self.setData({ idcard2: tempFilePaths[0] });
				}
			},
			fail: function () {
				wx.showToast({
					title: '请重新选择',
					icon: 'error',
				});
			},
		});
	},

	// 提交审核
	onSend: function () {
		this.setData({ dialogShow: true });
	},

	// 关闭弹框
	onCloseDialog: function () {
		this.setData({ dialogShow: false });
	},

	// 点击添加技能
	onAddSkill: function () {
		const { addList } = this.data;
		const randomStr = util.getRandomStr();
		addList.push({ id: randomStr, selectSkillId: '', selectSkillName: '', selectGradeId: '', selectGradeName: '' });
		this.setData({ addList: addList });
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

	// 选择技能
	onPickSkill: function (e) {
		const { value } = e.detail;
		const { idx } = e.currentTarget.dataset;
		const { addList } = this.data;
		addList[idx] = { ...addList[idx], selectSkillName: skills[value].name, selectSkillId: skills[value].id };
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
