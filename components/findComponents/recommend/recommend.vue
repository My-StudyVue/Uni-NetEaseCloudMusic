<template>
	<view class="recommend">
		<view class="recommend_title">
			推荐歌单
			<view class="recommend_btn" @click="toMusicList">查看更多</view>
		</view>
		<swiper display-multiple-items="3">
			<swiper-item v-for="item in poster" 
						 :key="item.id" 
						 style="width: 200rpx;" 
						 @click="toPlayList(item.id)">
				<text class="iconfont icon-playIcon">{{_getNum(item.playCount)}}</text>
				<image :src="item.picUrl" style="width: 200rpx;height: 200rpx;border-radius: 14rpx;position: relative;">
					<view class="recommend_swiper_title">{{item.name}}</view>
				</image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props:{
			poster: Array
		},
		methods:{
			toPlayList(playListId){
				uni.navigateTo({
					url:'/pages/music/playList/playList?playListId=' + playListId
				})
			},
			toMusicList(){
				// uni.navigateTo({
				// 	url:'./musicList/musicList'
				// })
			},
			_getNum(num){
				if(num < 100000){
					return num
				} else if(num >= 100000 && num < 10000000){
					return Math.floor(num / 10000) + '万'
				} else {
					return (num / 10000000).toFixed(1) + '亿'
				}
			}
		}
	}
</script>

<style>
	.recommend {
		padding-top: 30rpx;
	}
	.recommend_title {
		display: flex;
		justify-content: space-between;
		font-weight: 700;
		font-size: 36rpx;
		padding-bottom: 10rpx;
	}
	.recommend_btn {
		font-weight: 500;
		font-size: 24rpx;
		padding: 6rpx;
		border:2rpx solid #d2d2d2;
		border-radius: 30rpx;
	}
	.iconfont{
		z-index: 99;
		position: absolute;
		font-size: 20rpx;
		font-weight: 600;
		border: 2rpx solid rgba(0,0,0,.1);
		border-radius: 15rpx;
		background-color: rgba(0,0,0,.1);
		filter:Alpha(opacity=50);
		color: #fff;
		top: 5rpx;
		right: 42rpx;
	}
	
	.recommend_swiper_title {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 12px;
		width: 100px;
	}
	
	swiper{
	    width: 350px;
		height: 140px;
	}
	
	swiper-item{
	    width: 115px !important;
		transform: translate3d(0px, 0px, 0px);
	}
</style>
