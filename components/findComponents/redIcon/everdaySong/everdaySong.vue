<template>
	<view>
		<view class="title" 
		style="background: url('/static/images/index/everday.png');
			    background-size: 100%;
				color: #fff;">
			<text style="
					font-weight: 800;
					font-size: 70rpx;">{{day}}</text>
			<text>/{{month}}</text>
		</view>
		<view class="container">
			<view class="top" @click="playAllSongs">
				<view style="font-weight: 600;display: flex;">
					<view class="iconfont icon-pause"
						  style="font-size: 50rpx;padding-right: 20rpx;"/>
					<view>播放全部</view>
				</view>
				<view style="display: flex;z-index: 999;" @click="more">
					<view class="iconfont icon-duoxuankuang"
						  style="font-size: 40rpx;padding-left: 350rpx;padding-right: 20rpx;"></view>
					<view>多选</view>
				</view>
			</view>
			<scroll-view scroll-y class="bottom">
				<view class="item" 
					  v-for="(item, index) in everdayList" 
					  :key="item.id"
					  @click="toMusic(item.id, index)">
					<checkbox-group>
						<label>
							<checkbox v-show="isShow" :checked="isTrue" color="rgb(240, 19, 19)" style="transform:scale(0.9);" />
						</label>
					</checkbox-group>
					<image :src="item.al.picUrl" style="width: 100rpx;height: 100rpx;border-radius: 15rpx;"/>
					<view class="music">
						<text style="font-weight: 700;">{{item.name}}</text>
						<text class="author">{{item.ar[0].name}}-{{item.al.name}}</text>
					</view>
					<text class="iconfont icon-ziyuan"/>
				</view>
			</scroll-view>
			<!-- <musicBottom style="position: fixed;bottom: 0;"></musicBottom> -->
		</view>
	</view>
</template>

<script>
	// import musicBottom from '/pages/music/musicBottom/musicBottom'
	
	import request from 'utils/request.js'
	import pubsub from 'utils/pubsub.js'
	
	const appGlobalData = getApp().globalData;
	export default {
		data() {
			return {
				day:'',
				month:'',
				everdayList:[],//推荐列表数据
				isShow:false,
				isTrue:false,
				index:0,
			}
		},
		mounted() {
			// 判断用户是否登录
			const userInfo = appGlobalData.userInfo1 || appGlobalData.userInfo2 || appGlobalData.userInfo3
			if(!userInfo){
				uni.showToast({
					title:'请先登录',
					icon:'none',
					success:() => {
						uni.reLaunch({
							url:'/pages/login/loginMain/loginMain'
						})
					}
				})
			}
			this.day = new Date().getDate();
			this.month = new Date().getMonth() + 1;
			this.getEverdatList();
		},
		methods: {
			//获取每日推荐的数据
			async getEverdatList(){
				let everdayListDate = await request('/recommend/songs');
				this.everdayList = everdayListDate.data.dailySongs
				pubsub.music(everdayListDate.data.dailySongs,this.index)
			},
			playAllSongs(){
				// console.log('xxx')
				// let allSongs = this.everdayList;
				// uni.$emit('allSongs',{
				// 	msg:allSongs
				// })
			},
			more(){
				this.isShow = !this.isShow
			},
			toMusic(songId,index){
				this.index = index
				if(!this.isShow){
					uni.navigateTo({
						url:'/pages/music/music?musicId=' + songId
					})
				}
			},
		},
		components:{
			// musicBottom
		}
	}
</script>

<style>
	body{
		height: 100%;
	}
	.title{
		height: 400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.container{
		position: relative;
		top: -30rpx;
		background: #fff;
		height: 100%;
		padding: 0 20rpx 0 20rpx;
		border-radius: 30rpx;
	}
	.container .top{
		display: flex;
		align-items: center;
		height: 80rpx;
	}
	
	.container .bottom{
		height: calc(100vh - 500rpx);
	}
	.container .bottom .item {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.container .bottom .item .music{
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}
	.container .bottom .item .music text{
		height: 50rpx;
		line-height: 50rpx;
		max-width: 500rpx;
		white-space: normal;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.container .bottom .item .music .author{
		font-size: 26rpx;
		color: #777777;
	}
	.container .bottom .item .iconfont{
		position: absolute;
		right: 0;
		width: 40rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-weight: 600;
		font-size: 40rpx;
		color: #555555;
	}
</style>
