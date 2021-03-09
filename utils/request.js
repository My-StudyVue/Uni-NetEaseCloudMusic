//封装网络请求
import config from './config.js'

//同时发送异步代码的次数
let ajaxtime=0;
export function Finish(){
	return true
}

export default (url, data = {}, method='GET') => {
	//发送一次 +1
	ajaxtime++;
	return new Promise((resolve,reject) => {
		uni.request({
			// url: config.localhost + url,    //本地测试
			url: config.vercelHost + url,      //vercel测试
			// url: config.mobileHost + url,   //真机测试
			data,
			method,
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err.data)
			},
			complete:()=>{ //成功失败都执行的函数
			    ajaxtime--;
			    if(ajaxtime===0){
					Finish()
			    }
			}
		})
	}).catch(e => {});
}