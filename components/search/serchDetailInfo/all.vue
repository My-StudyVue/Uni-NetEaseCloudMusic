<template>
	<scroll-view class="all" scroll-y>
		<view class="song">
			<view class="title" style="border-bottom: 1rpx solid #D9D9D9;">
				<text style="font-size: 37rpx;">单曲</text>
				<view class="btn">
					<text class="iconfont icon-playIcon"/>
					播放全部
				</view>
			</view>
			<view class="songItem"
				  v-for="item in songList"
				  @click="toMusic(item.id)">
				<view class="content">
					<text style="font-weight: 600;">{{item.name}}</text>
					<text style="font-size: 28rpx;color: #4c4c4c;">{{item.ar[0].name}} - {{item.name}}</text>
				</view>
				<view class="iconfont icon-ziyuan"/>
			</view>
			<view class="more" @click="more">
				<text>查看全部{{songCount > 999 ? '999+' :songCount}}首单曲</text>
				<text class="iconfont icon-xiayige"/>
			</view>
		</view>
		<view class="playList">
			<view class="title" style="font-size: 37rpx;">歌单</view>
			<view class="playListItem"
				  v-for="item in playList"
				  style="height: 150rpx;"
				  @click="toPlayList(item.id)">
				<image :src="item.coverImgUrl" style="width: 140rpx;height: 140rpx;border-radius: 20rpx;margin-right: 10rpx;"/>
				<view class="content">
					<text style="font-weight: 600;font-size: 36rpx;">{{item.name}}</text>
					<text>{{item.trackCount}}首,by{{item.creator.nickname}},播放{{_getNum(item.playCount)}}次</text>
					<text v-if="item.name != '1'">包含《1》</text>
				</view>
			</view>
			<view class="more" @click="more">
				<text>查看全部{{playlistCount}}首单曲</text>
				<text class="iconfont icon-xiayige"/>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import request from 'utils/request.js'
	
	export default {
		data() {
			return {
				songList:[],
				songCount:0,
				playList:[],
				playlistCount:0,
			}
		},
		props:{
			all: Object
		},
		mounted() {
			this.getSearchResult(this.all.keyWords)
		},
		methods: {
			async getSearchResult(keywords){
				let songListDate = await request('/cloudsearch',{keywords, limit:5})
				this.songList = songListDate.result.songs
				this.songCount = songListDate.result.songCount
				//
				let playListDate = await request('/cloudsearch',{keywords, limit:5, type:1000})
				this.playList = playListDate.result.playlists
				this.playlistCount = playListDate.result.playlistCount
			},
			toMusic(songId){
				uni.navigateTo({
					url:'/components/music/music?musicId=' + songId
				})
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
			more(e){
				let tab = this.all.tab
				if(e.currentTarget.offsetTop <= 500){
					tab = 1
				} else {
					tab = 2
				}
				this.$emit("moreClick", tab)
			},
		}
	}
</script>

<style>
	uni-page-body, body{
		height: 100%;
	}
	.all{
		height: 100%;
		padding-top: 30rpx;
	}
	.song, .playList{
		padding: 20rpx;
		margin: 0 30rpx;
		margin-bottom: 30rpx;
		background: #fff;
		border-radius: 30rpx;
	}
	
	.title {
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
		align-items: center;
		font-weight: 700;
		margin-bottom: 20rpx;
	}
	.title .btn{
		display: flex;
		line-height: 50rpx;
		text-align: center;
		margin-left: 430rpx;
		padding: 5rpx;
		border: 2rpx solid #d2d2d2;
		border-radius: 30rpx;
		font-size: 24rpx;
	}
	
	.songItem, .playListItem{
		height: 100rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
	}
	.songItem .content{
		display: flex;
		flex-direction: column;
		white-space: nowrap;
		width: 600rpx;
		overflow: hidden;
		text-overflow:ellipsis;
	}
	.songItem .iconfont{
		font-size: 45rpx;
	}
	.more{
		border-top: 1rpx solid #D9D9D9;
		padding-top: 20rpx;
		line-height: 42rpx;
		text-align: center;
		font-size: 28rpx;
		color: #6c6c6c;
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
</style>
