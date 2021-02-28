<template>
	<swiper indicator-dots autoplay :interval="interval" :duration="duration" circular indicator-active-color="#fff">
		<swiper-item v-for="item in swipers" :key="item.bannerId" @click="outBanner(item)">
			<image :src="item.pic" style="height: 100%;width: 100%;border-radius: 0.25rem;"/>
			<view :style="{'background': item.titleColor}"
				  :class="item.typeTitle.length < 3 ? 'title' : 'titleLong'">{{item.typeTitle}}</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		data() {
			return {
				interval: 5000,
				duration: 500,
			}
		},
		props:{
			swipers: Array
		},
		methods:{
			outBanner(bannerInfo){
				if(bannerInfo.song){
					let songId = bannerInfo.song.id
					uni.navigateTo({
						url:'/components/music/music?musicId=' + songId
					})
				}
				if(bannerInfo.url){
					window.location.href = bannerInfo.url
				}
			}
		}
	}
</script>

<style>
	swiper {
		padding-top: 80rpx;
	}
	swiper-item{
		border-radius: 0.5rem;
	}
	
	.title{
		position: relative;
		top: -68rpx;
		left: 608rpx;
		background: #aa5500;
		width: 50rpx;
		font-size: 20rpx;
		text-align: center;
		font-weight: 600;
		color: #fff;
		padding: 15rpx;
		border-top-left-radius: 0.5rem;
		opacity: 0.85;
	}
	.titleLong {
		position: relative;
		top: -68rpx;
		left: 565rpx;
		width: 100rpx;
		font-size: 20rpx;
		text-align: center;
		font-weight: 600;
		color: #fff;
		padding: 15rpx;
		border-top-left-radius: 0.5rem;
		opacity: 0.85;
	}
</style>
