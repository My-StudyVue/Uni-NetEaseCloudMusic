<template>
	<view class="container">
		<view class="top">
			<view style="font-weight: 600;display: flex;">
				<view class="iconfont icon-pause"
					  style="font-size: 50rpx;padding-right: 20rpx;"/>
				<view>播放全部</view>
			</view>
			<view style="display: flex;" @click="more">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				isTrue:false,
				index:0,
				everdayList:[],
			}
		},
		methods: {
			more(){
				this.isShow = !this.isShow
			},
			toMusic(songId,index){
				this.index = index
				if(!this.isShow){
					uni.navigateTo({
						url:'/components/music/music?musicId=' + songId
					})
				}
			},
		}
	}
</script>

<style>
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
