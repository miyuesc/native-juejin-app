import getUserInfo from '../utils/userInfo'

export const baseUrl = "https://api.juejin.cn";

export const cookie = getUserInfo()?.cookie


export function getData(url, params) {
	const firstUrl = `${baseUrl}${url}`;
	let paramsUrl = "?";
	for (let key in params) {
		paramsUrl += `${key}=${params[key]}&`;
	}
	return new Promise(function (resolve, reject) {
		wx.request({
			url: firstUrl,
			method: "GET",
			header: {
				cookie: cookie
			},
			success: function (res) {
				if (res.data && res.data.err_no === 0) {
					resolve(res.data)
					return;
				}
				wx.showToast({
					title: res.data.err_msg || '请求失败，请重试',
					icon: 'error'
				})
				reject(res.data)
			},
			fail: function (err) {
				reject(err.err_msg)
			}
		})
	})
}


export function postData(url, data, params) {
	const firstUrl = `${baseUrl}${url}`;
	let paramsUrl = "?";
	if (params) {
		for (let key in params) {
			paramsUrl += `${key}=${params[key]}&`;
		}
	}
	return new Promise(function (resolve, reject) {
		wx.request({
			url: `${firstUrl}${paramsUrl}`,
			method: "POST",
			data: data,
			header: {
				cookie: cookie
			},
			success: function (res) {
				if (res.data && res.data.err_no === 0) {
					resolve(res.data)
					return;
				}
				wx.showToast({
					title: res.data.err_msg || '请求失败，请重试',
					icon: 'error'
				})
				reject(res.data)
			},
			fail: function (err) {
				reject(err.errMsg)
			}
		})
	})
}

export function getPageHtml(url) {
	return new Promise(function (resolve, reject) {
		wx.request({
			url: url,
			method: "GET",
			header: {
				cookie: cookie
			},
			success: function (res) {
				resolve(res)
			},
			fail: function (err) {
				reject(err)
			}
		})
	})
}