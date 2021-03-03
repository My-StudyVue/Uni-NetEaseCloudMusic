<template>
	<scroll-view class="musicList" scroll-y>
		<view class="playListItem"
			  v-for="item in playlist"
			  style="height: 150rpx;"
			  @click="toPlayList(item.id)">
			<image :src="item.coverImgUrl" style="width: 140rpx;height: 140rpx;border-radius: 20rpx;margin-right: 10rpx;"/>
			<view class="content">
				<text style="font-weight: 600;font-size: 36rpx;">{{item.name}}</text>
				<text>{{item.trackCount}}首,by{{item.creator.nickname}},播放{{_getNum(item.playCount)}}次</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import request from 'utils/request.js'
	
	export default {
		data() {
			return {
				playlist:[],
			}
		},
		props:{
			musicList: String
		},
		mounted() {
			this.getplaylist(this.musicList)
		},
		methods: {
			async getplaylist(keywords){
				let playlistDate = await request('/cloudsearch',{keywords, limit:100, type:1000})
				this.playlist = playlistDate.result.playlists
			},
			toPlayList(playListId){
				uni.navigateTo({
					url:'/components/music/playList/playList?playListId=' + playListId
				})
			},
			_getNum(num){
				if(num < 100000){
					return num
				}else if(num >= 100000 && num < 10000000){
					return Math.floor(num / 10000) + '万'
				} else {
					return (num / 10000000).toFixed(1) + '亿'
				}
			},
			goTop(e){
				console.log('xxxx',e)
				uni.showToast({
				                icon:"none",
				                title:"纵向滚动 scrollTop 值已被修改为 0"
				            })
			}
		}
	}
</script>

<style>
	.musicList{
		padding: 20rpx;
	}
	.playListItem{
		border-radius: 20rpx;
		height: 100rpx;
		padding: 20rpx;
		background: #fff;
		display: flex;
		align-items: center;
	}
	.playListItem .content{
		font-size: 28rpx;
		display: flex;
		flex-direction: column;
	}
	.playListItem .content text{
		font-size: 26rpx;
		white-space: nowrap;
		max-width: 500rpx;
		overflow: hidden;
		text-overflow:ellipsis;
	}
	
	uni-scroll-view{
		width: 95%;
	}
</style>
