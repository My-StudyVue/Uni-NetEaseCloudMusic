<template>
	<view class="chart">
		<view class="chart_title">
			排行榜
			<view class="chart_btn">查看更多</view>
		</view>
		<swiper>
			<swiper-item v-for="item in chart" :key="item.id">
				<view :class="item.background" style="color: #FFFFFF;border-radius: 10px;padding: 15px 0 10px 10px;">
					<view style="padding-bottom: 5px;font-weight: 600;">{{item.name}} ></view>
					<view v-for="(title,index) in item.tracks" :key="title.id" class="chart_swiperItem_card" @click="toMusic(title.id)">
						<image :src="title.al.picUrl" style="height: 40px;width: 45px;border-radius: 5px;"/>
						<view>
							<view style="font-size: 15px; font-weight: 600;width: 180px;padding-left: 5px;">{{index + 1}} {{title.al.name}}</view>
							<text style="font-size: 10px;">-{{title.ar[0].name}}</text>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props:{
			chart: Array
		},
		methods:{
			toMusic(songId){
				uni.navigateTo({
					url:'/components/music/music?musicId=' + songId
				})
			},
		}
	}
</script>

<style>
	.chart {
		padding-top: 40rpx;
	}
	.chart_title {
		display: flex;
		justify-content: space-between;
		font-weight: 700;
		font-size: 36rpx;
		padding-bottom: 10rpx;
	}
	.chart_btn {
		font-weight: 500;
		font-size: 24rpx;
		padding: 6rpx;
		border:2rpx solid #d2d2d2;
		border-radius: 30rpx;
	}
	.chart_swiper_view0{
		background:#04183b
	}
	.chart_swiper_view1{
		background:#340000
	}
	.chart_swiper_view2{
		background:#673300
	}
	.chart_swiper_view3{
		background:#aa5500
	}
	.chart_swiper_view4{
		background:#d3d300
	}
	.chart_swiperItem_card{
		display: flex;
		align-items: center;
		height: 100rpx;
	}
	.chart_swiperItem_card view{
		display: inline-block;
		white-space: nowrap; 
		width: 100%; 
		overflow: hidden;
		text-overflow:ellipsis;
	}
	
	swiper{
	    width: 700rpx;
		height: 440rpx;
	}
	
	swiper-item{
	    width: 600rpx !important;
		padding-right: 20rpx;
	}
</style>
