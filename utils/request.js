const config = require('../config/config');

const { baseUrl } = config;

module.exports = {
	get: (params = {}) => {
		return new Promise((resolve, reject) => {
			const url = baseUrl + params.url;
			console.log(`请求url: 传入的url: ${params.url}  拼接之后的url： ${url}`);
			wx.request({
				method: 'GET',
				url,
				data: params.data,
				success: function (res) {
					if (res.data && res.data.code === 200) {
						resolve(res.data.data || {});
					} else if (res.data && res.data.code === 500) {
						wx.showToast({
							title: res.data.message,
							icon: 'error',
							duration: 2000,
						});
						reject(res.data || {});
					} else {
						wx.showToast({
							title: '网络异常',
							icon: 'error',
							duration: 2000,
						});
						reject(res.data || {});
					}
				},
				fail: function (err) {
					console.info('服务端错误: ', err);
					wx.showToast({
						title: '网络异常',
						icon: 'error',
						duration: 2000,
					});
					reject(err);
				},
			});
		});
	},
	post: (params = {}) => {
		return new Promise((resolve, reject) => {
			const url = baseUrl + params.url;
			console.log(`请求url: 传入的url: ${params.url}  拼接之后的url： ${url}`);
			wx.request({
				method: 'POST',
				url,
				data: {
					...params.data,
				},
				success: function (res) {
					if (res.data && res.data.code === 200) {
						resolve(res.data.data || {});
					} else if (res.data && res.data.code === 500) {
						wx.showToast({
							title: res.data.message,
							icon: 'error',
							duration: 2000,
						});
						reject(res.data || {});
					} else {
						wx.showToast({
							title: '网络异常',
							icon: 'error',
							duration: 2000,
						});
						reject(res.data || {});
					}
				},
				fail: function (err) {
					console.info('服务端错误: ', err);
					wx.showToast({
						title: '网络异常',
						icon: 'error',
						duration: 2000,
					});
					reject(err);
				},
			});
		});
	},
	uploadFile: (params = {}) => {
		return new Promise((resolve, reject) => {
			const url = baseUrl + params.url;
			wx.uploadFile({
				filePath: params.data,
				name: 'file',
				url,
				formData: params.formData || {},
				success: function (result) {
					const filename = JSON.parse(result.data).data;
					resolve(filename);
				},
				fail: function (e) {
					console.log(e, '上传失败');
					wx.showToast({
						title: '上传失败',
						icon: 'error',
					});
					reject('系统错误');
				},
			});
		});
	},
};
