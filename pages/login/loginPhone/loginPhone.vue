
<template>
	<view class="loginPhone">
		登录体验更多精彩
		<view style="font-size: 20rpx;color: #AAAAAA;padding: 20rpx 0 60rpx 0;">未注册手机号登陆后将自动创建账号</view>
		<input class="phone" id="phone"
			focus
			placeholder="请输入手机号" 
			type="number"
			maxlength="11"
			v-model="num"/>
		<view class="pwd">
			<input id="pwd"
				placeholder="请输入密码" 
				password
				v-model="pwd"/>
			<text @click="forgetPwd">忘记密码?</text>
		</view>
		<button
			style="
			width: 650rpx;
			height: 100rpx;
			border-radius: 50rpx;
			background: rgb(240, 19, 19);
			color: #fff;"
			@click="login"
		>登录</button>
	</view>
</template>

<script>
	import request from 'utils/request.js'
	export default {
		data() {
			return {
				num:'',
				pwd:'',
			}
		},
		methods: {
			forgetPwd(){
				uni.navigateTo({
					url:'./loginForgetPwd'
				})
			},
			async login(){
				const phone = this.num
				const password = this.pwd
				let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
				if(!phone){
					uni.showToast({
						title:'手机号不能为空',
						icon:'none'
					})
					return
				}else if(!phoneReg.test(phone)){
					uni.showToast({
						title:'手机号格式不正确',
						icon:'none'
					})
					return
				}
				if(!password){
					uni.showToast({
						title:'密码不能为空',
						icon:'none'
					})
					return
				}
				//
				let result = await request('/login/cellphone',{phone, password})
				if(result.code === 200){
					setTimeout(() => {
						uni.navigateTo({
							url:'/pages/index/index'
						})
					},1000)
					uni.setStorageSync('userLogin', {phone:phone,password:password})
					uni.setStorageSync('userInfo1',JSON.stringify(result.profile))
					uni.showToast({
						title:'',
						icon:'loading'
					})
				}else if(result.code === 501){
					uni.showToast({
						title:'手机号错误',
						icon:'none'
					})
				}else if(result.code === 502){
					uni.showToast({
						title:'密码错误',
						icon:'none'
					})
				}else{
					uni.showToast({
						title:'登录失败，请重新登录',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style>
	.loginPhone{
		padding: 40rpx 20rpx 0 20rpx;
	}
	.loginPhone .phone{
		border-bottom: 1rpx solid #AAAAAA;
		margin-bottom: 60rpx;
	}
	.loginPhone .pwd{
		display: flex;
		font-size: 25rpx;
		color: #006699;
		border-bottom: 1rpx solid #AAAAAA;
		margin-bottom: 60rpx;
	}
	.loginPhone .pwd input{
		color: #000000;
		width: 83%;
	}
</style>
