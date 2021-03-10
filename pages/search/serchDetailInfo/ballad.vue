<template>
	<view class="container">
		<view class="top">
			<view style="font-weight: 600;display: flex;">
				<view class="iconfont icon-pause"
					  style="font-size: 50rpx;padding-right: 20rpx;"/>
				<view>播放全部</view>
			</view>
			<view style="display: flex;z-index: 999;" @click="more">
				<view class="iconfont icon-duoxuankuang"
					  style="font-size: 40rpx;padding-left: 320rpx;padding-right: 20rpx;"></view>
				<view>多选</view>
			</view>
		</view>
		<scroll-view scroll-y class="bottom">
			<view class="item" 
				  v-for="(item, index) in balladList" 
				  :key="item.id"
				  @click="toMusic(item.id,index)">
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
	</view>
</template>

<script>
	import request from 'utils/request.js'
	
	const appGlobalData = getApp().globalData;
	export default {
		data() {
			return {
				isShow:false,
				isTrue:false,
				index:0,
				balladList:[],
			}
		},
		props:{
			ballad: String
		},
		mounted() {
			this.getballadList(this.ballad)
		},
		methods: {
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
			async getballadList(keywords){
				let balladListDate = await request('/cloudsearch',{keywords, limit:100})
				let balladList = balladListDate.result.songs
				this.balladList = balladList
				appGlobalData.playIdList = balladList.map(item => {
					return item.id
				})
			}
		}
	}
</script>

<style>
	uni-page-body, body{
		height: 100%;
	}
	.container{
		position: relative;
		height: 100%;
		margin: 0 10rpx;
		padding: 20rpx;
	}
	.container .top{
		padding: 20rpx 20rpx 0 20rpx;
		background: #fff;
		display: flex;
		align-items: center;
		height: 80rpx;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}
	
	.container .bottom{
		width: 325px;
		padding: 0 20rpx;
		background: #fff;
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
		height: calc(100vh - 300rpx);
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
		white-space: nowrap;
		max-width: 500rpx;
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
