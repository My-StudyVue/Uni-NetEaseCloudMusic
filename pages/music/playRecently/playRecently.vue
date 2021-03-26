<template>
	<view class="container">
		<view class="top">
			<text style="font-size: 40rpx;font-weight: 600;">当前播放</text>({{playRecentlyId.length}})
			<text class="iconfont icon-lajixiang"/>
		</view>
		<scroll-view scroll-y class="bottom">
			<view class="item" 
				  v-for="item in song" 
				  :key="item.id">
				<view class="music">
					<text style="font-weight: 700;">{{item.name}}-</text>
					<text class="author">{{item.ar[0].name}}</text>
				</view>
				<text class="iconfont icon-quxiao"/>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import request from 'utils/request.js'
	
	let _musicIdList = []
	export default {
		data() {
			return {
				song:[]
			}
		},
		props:{
			playRecentlyId: Array
		},
		watch:{
			playRecentlyId(id){
				this.playRecentlyId = id
			}
		},
		mounted() {
			this.getMusicInfo(this.playRecentlyId)
		},
		methods: {
			async getMusicInfo(musicIdList){
				musicIdList.forEach(item => {
					_musicIdList += item + ","
				})
				//去掉最后一个逗号
				if (_musicIdList.length > 0) {
					_musicIdList = _musicIdList.substr(0, _musicIdList.length - 1);
				}
				let songData = await request('/song/detail',{ids:_musicIdList});
				this.song = songData.songs
			},
		}
	}
</script>

<style>
	.container{
		position: fixed;
		z-index: 999;
		bottom: 100rpx;
		background: rgba(255, 255, 255, .8);
		width: 80%;
		height: 40%;
		border-radius: 30rpx;
	}
	.container .top{
		padding: 10rpx 20rpx;
		display: flex;
		align-items: center;
		height: 80rpx;
		font-size: 30rpx;
	}
	.container .top .iconfont{
		font-size: 40rpx;
		margin-left: 300rpx;
	}
	
	.container .bottom{
		height: calc(100vh - 930rpx);
	}
	.container .bottom .item {
		position: relative;
		display: flex;
		align-items: center;
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
		right: 40rpx;
		width: 40rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-weight: 600;
		font-size: 40rpx;
		color: #555555;
	}
</style>
