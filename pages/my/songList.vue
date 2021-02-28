<template>
	<view class="songList">
		<view class="title">{{title}}</view>
		<scroll-view scroll-y>
			<view class="songListTop">
				<view class="songListItem"
					  v-for="item in songList"
					  :key="item.id"
					  @click="toPlayList(item.id)">
					<image :src="item.coverImgUrl" style="height: 100rpx;width: 100rpx;border-radius: 5px;"/>
					<view class="songListItemInfo">
						<text style="font-weight: 700;">{{item.name}}</text>
						<text style="font-size: 26rpx;">{{item.trackCount}}首</text>
					</view>
					<text class="iconfont icon-ziyuan"/>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props:{
			songList: Array,
			title: ''
		},
		methods: {
			toPlayList(playListId){
				uni.navigateTo({
					url:'/components/music/playList/playList?playListId=' + playListId
				})
			},
		},
	}
</script>

<style>
	.songList{
		height: 1700rpx;
	}
	.title{
		height: 60rpx;
		line-height: 60rpx;
		border: 1rpx solid #fff;
		margin: 20rpx;
		text-align: center;
	}
	.songListTop{
		height: calc(775px - 90px);
	}
	.songListItem{
		display: flex;
		padding-bottom: 20rpx;
	}
	.songListItemInfo{
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
		min-width:0;
	}
	.songListItemInfo text{
		line-height: 50rpx;
		max-width: 500rpx;
		overflow: hidden;    
		text-overflow:ellipsis;    
		whitewhite-space: nowrap;
	}
	.songListItem .iconfont{
		position: absolute;
		right: 0;
		width: 40rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-weight: 600;
		font-size: 40rpx;
	}
</style>
