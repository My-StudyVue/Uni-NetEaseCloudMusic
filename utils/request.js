//封装网络请求
import config from './config.js'

export default (url, data = {}, method='GET') => {
	return new Promise((resolve,reject) => {
		uni.request({
			url: config.host + url,
			// url: config.mobileHost + url,//真机测试
			data,
			method,
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err.data)
			}
		})
	}).catch(e => {});
}