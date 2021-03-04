<template>
	<view class="logForget">
		请设置登录密码，8-20位字符，至少包含字母/数字/符号2种组合
		<view class="foget">
			<input
				focus
				placeholder=""
				:type="type"
				:value="pwd"
				@input="change"
				/>
			<text class="iconfont" :class="isSee ? 'icon-see' : 'icon-nosee'" @click="seePwd"></text>
		</view>
		<button
			:disabled="disabled"
			style="
			width: 650rpx;
			height: 100rpx;
			border-radius: 50rpx;
			color: #fff;"
			:style="{'background': background}"
			@click="next"
		>下一步</button>
		<view class='toast_box' v-show='ifName'>
			<view class="box">
				<view>输入验证码</view>
				<view>已发送4位验证码至
					<span style="color: #2c83a8;">{{userPhone}}</span>
				</view>
				<view style="display: flex;color: #555555;">
					<input
						focus
						type="number" 
						maxlength="4"
						v-model="code"/>
					<view class="time" v-if="time > 0">重新获取({{time}}s)</view>
					<view class="time" v-else @tap="againTimeBtn">重新获取</view>
				</view>
				<button
				 style="
				 width: 200rpx;
				 line-height: 80rpx;
				 border-radius: 50rpx;
				 background-color: #00FF7F;"
				 @click="login"
				>立即登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import request from 'utils/request.js'
	export default {
		data() {
			return {
				type: 'password',
				pwd:'',
				isSee: false,
				disabled: true,
				background:'rgba(240, 19, 19, 0.5)',
				ifName:false,
				
				userPhone:null,//用户号码和密码
				userPassword:null,
				
				code:'',
				time: 60,
				timing:null,
			}
		},
		methods: {
			change(e){
				this.pwd = e.target.value
				const password = this.pwd
				if(!password){
					this.background = 'rgba(240, 19, 19, 0.5)',
					this.disabled = true
				}else{
					this.background = 'rgb(240, 19, 19)',
					this.disabled = false
				}
			},
			seePwd(){
				if(this.isSee){
					this.isSee = false
					this.type = 'password'
				}else if(this.isSee = !this.isSee){
					this.isSee = true
					this.type = 'text'
				}
			},
			async next(e){
				let phone = uni.getStorageSync('userPhone');
				if(phone){
					this.userPhone = userPhone
				}
				//测试
				let password = this.pwd
				if(password.length < 8 || password.length > 20){
					uni.showToast({
						title:'需8-20位字符',
						icon:'none'
					})
					return
				}
				if(password = uni.getStorageSync('userPassword')){
					uni.showToast({
						title:'不能和原密码一致',
						icon:'none'
					})
				}
				//
				let result = await request('/captcha/sent',{phone})
				if(result.code === 200){
					this.ifName = true,
					this.againTime()
				}else if(result.code === 405){
					uni.showToast({
						title:'发送验证码间隔过短',
						icon:'none'
					})
				}else if(result.code === 400){
					uni.showToast({
						title:'发送验证码超过限制:每个手机号一天只能发5条验证码',
						icon:'none'
					})
				}else{
					uni.showToast({
						title:'手机号有误,请确认手机号码',
						icon:'none'
					})
				}
			},
			againTime() {
				this.timing = setInterval(() => {
					this.time--;
					if (this.time <= 0) {
						clearInterval(this.timing)
					}
				}, 1000)
			},
			againTimeBtn() {
				this.time = 60;
				this.againTime()
			}, 
			async login(){
				let phone = uni.getStorageSync('userPhone');
				//测试
				const captcha = this.code
				let result = await request('/captcha/verify',{phone,captcha})
				if(result.code === 200){
					setTimeout(() => {
						uni.navigateTo({
							url:'/pages/index/index'
						})
					},1000)
					//将用户信息存储至本地
					uni.setStorageSync('userInfo3',JSON.stringify(result.profile))
					uni.showToast({
						title:'',
						icon:'loading'
					})
				}else if(result.code === 503){
					uni.showToast({
						title:'验证码错误',
						icon:'none'
					})
				}else{
					uni.showToast({
						title:'手机号有误,请确认手机号码',
						icon:'none'
					})
				}
			}
		},
	}
</script>

<style>
	.logForget{
		padding: 40rpx 20rpx 0 20rpx;
		color: #AAAAAA;
		font-size: 28rpx;
	}
	.logForget .foget{
		display: flex;
		border-bottom: 1rpx solid #AAAAAA;
		margin: 20rpx 0 60rpx 0;
	}
	.logForget .foget input{
		width: 100%;
		color: #000000;
	}
	
	.logForget .toast_box {
		width: 700rpx;
		height: 500rpx;
		position: fixed;
		top: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: #000000;
	}
	.logForget .toast_box .box{
		width: 70%;
		height: 70%;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: linear-gradient(to right, rgba(150,251,196,.7), rgba(249,245,134,.3));
	}
	.box input{
		border-bottom: 1rpx solid #000000;
		width: 250rpx;
		text-align: center;
	}
	.box .time{
		font-size: 20rpx;
		margin-left: 20rpx;
		padding-bottom: 50rpx;
	}
</style>
