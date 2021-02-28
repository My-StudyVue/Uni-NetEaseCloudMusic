<template>
	<view class="login">
		<view style="padding: 10rpx 20rpx 10rpx 20rpx;">
			<view class="login_log">
				<view class="iconfont icon-03"></view>
				<view class="wave"></view>
			</view>
			<view class="login_box">
				<view class="login_boxPhone">
					{{userphone ? userphone : '***********'}}
					<view class="iconfont icon-write" @click="write"></view>
				</view>
				<button style="
						width: 500rpx;
						line-height: 80rpx;
						text-align: center;
						border-radius: 100rpx;
						color: rgb(240, 19, 19);
						margin-bottom: 30rpx;"
						@click="login">
							一键登录</button>
				<button plain 
						style="
						width: 500rpx;
						line-height: 80rpx;
						text-align: center;
						border-radius: 100rpx;
						margin-bottom: 40rpx;
						color: #fff;
						border: 1rpx solid #fff;"
						@click="test">
							立即体验</button>
				<view class="login_boxWay">
					<view v-for="(item,index) in loginWay" :key="index">
						<view class="iconfont" :class="item.iconUrl" @click="loginWay"></view>
					</view>
				</view>
				<view class="login_agree">
					<checkbox-group>
						<label>
							<checkbox value="cb" :checked="isAgree" @click="checkAgree"/>同意
						</label>
					</checkbox-group>
					<view v-for="(item,index) in loginAgree" :key="index">
						<text @tap="agreement(index)">{{item.text}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from 'utils/request.js'
	export default {
		data() {
			return {
				userphone:null,
				loginWay:[
					{
						iconUrl:'icon-wechat'
					},
					{
						iconUrl:'icon-qq'
					},
					{
						iconUrl:'icon-weibo'
					},
				],
				isAgree:false,
				loginAgree:[
					{
						id: 0,
						text:'《用户协议》',
						url:'https://st.music.163.com/official-terms/service',
					},
					{
						id: 1,
						text:'《隐私政策》',
						url:'https://st.music.163.com/official-terms/privacy',
					},
					{
						id: 2,
						text:'《儿童隐私政策》',
						url:'https://st.music.163.com/official-terms/children',
					}
				],
			}
		},
		mounted() {
			//读取用户基本信息
			let phone = uni.getStorageSync('userphone');
			if(phone){
				// phone.match(/(\d{3})(\d{4})(\d{4})/)
				// 		 .slice(1)
				// 		 .reduce((value, item, index) => {
				// 			return index === 1 ? value + "****" : value + item;
				// 			});
				this.userphone = phone
			}
		},
		methods: {
			write(){
				if(!this.isAgree){
					this._agreementToast()
				} else {
					uni.navigateTo({
						url:'../loginPhone/loginPhone'
					})
				}
			},
			async login(){
				let phone = uni.getStorageSync('userphone');
				let password = uni.getStorageSync('userPassword');
				let result = await request('/login/cellphone',{phone, password})
				if(!this.isAgree){
					this._agreementToast()
				} else if(result.code === 200){
					setTimeout(() => {
						uni.navigateTo({
							url:'/pages/index/index'
						})
					},1000)
					uni.showToast({
						title:'',
						icon:'loading'
					})
				}
			},
			test(){
				if(!this.isAgree){
					this._agreementToast()
				} else{
					setTimeout(() => {
						uni.navigateTo({
							url:'/pages/index/index'
						})
					},1000)
					uni.showToast({
						title:'',
						icon:'loading'
					})
				}
			},
			checkAgree(){
				this.isAgree = !this.isAgree
			},
			// loginWay(){},
			agreement(current){
				this.loginAgree.map((i) => {
					if(current === i.id){
						uni.navigateTo({
							url:'/components/login/loginMain/agreement/agreement?urlId=' + i.url + '&titleId=' + i.text
						})
					}
				})
			},
			_agreementToast(){
				uni.showToast({
					title:'请先勾选同意《用户协议》《隐私政策》《儿童隐私政策》',
					icon: 'none'
				})
			}
		},
	}
</script>

<style>
	body {
		height: 100%;
	}
	.login {
		height: 100%;
		background: rgb(240, 19, 19);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.login_log{
		position: relative;
		height: 1150rpx;
		display: flex;
		justify-content: center;
		top: 450rpx;
	}
	.login_log .iconfont{
		position: absolute;
		width: 150rpx;
		height: 150rpx;
		background: #FF0000;
		font-size: 100rpx;
		font-weight: 1000;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login_log .wave{
		top: -175rpx;
		position: absolute;
		width: 500rpx;
		height: 500rpx;
		border: 1rpx solid #333333;
		border-radius: 50%;
		opacity: 0;
		animation: waveCircle 3s ease-in infinite;
	}
	@-webkit-keyframes waveCircle {
	    0%{
	      transform: scale(0);
	      opacity: 0.2;
	    }
	    10%{
	      transform: scale(0.1);
	      opacity: 0.2;
	    }
	    20%{
	      transform: scale(0.2);
	      opacity: 0.2;
	    }
	    30%{
	      transform: scale(0.3);
	      opacity: 0.2;
	    }
	    75%{
	      transform: scale(0.6);
	      opacity: 0.1;
	    }
	    100%{
	      transform: scale(1);
	      opacity: 0;
	    }
	}
	
	.login_box{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.login_boxPhone{
		display: flex;
		padding-bottom: 40rpx;
	}
	.login_boxPhone .iconfont{
		z-index: 999;
		padding-left: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.login_boxPhone .iconfont:active{
		background: #fff;
		opacity: 0.5;
	}
	.login_boxWay{
		width: 450rpx;
		display: flex;
		justify-content: space-between;
		padding-bottom: 40rpx;
	}
	.login_boxWay .iconfont{
		width: 60rpx;
		height: 60rpx;
		border: 1rpx solid #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40rpx;
		color: #fff;
	}
	.login_agree{
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20rpx;
	}
	.login_agree checkbox{
		transform:scale(0.5);
	}
</style>
