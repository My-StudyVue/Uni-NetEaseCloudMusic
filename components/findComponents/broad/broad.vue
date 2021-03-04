<template>
	<view class="broad">
		<view class="broad_title">
			<view :class="{ 'active': index == tab }"
				  v-for="(item,index) in tabList" 
				  :key="index"
				  @click="clickTab(index)">
				<text v-text="item.title" style="padding: 0 10rpx;"/>
			</view>
		</view>
		<swiper class="broad_container">
			<swiper-item v-for="(item,index) in broad"
						 :key="index" 
						 style="width: 200rpx;">
				<image :src="item.picUrl" style="width: 200rpx;height: 200rpx;border-radius: 50%;">
					<view class="broad_container_title">{{item.name}}</view>
				</image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab:0,
				tabList:[
					{
						title:'24小时播客',
					},
					{
						title:'|',
					},
					{
						title:'广播电台',
					},
				],
			}
		},
		props:{
			broad:Array
		},
		methods: {
			clickTab(current){
				if(current == 0 || current == 2){
					this.tab = current
				}
			},
		}
	}
</script>

<style>
	.broad{
		
	}
	.broad_title{
		height: 100rpx;
		display: flex;
		align-items: center;
		color: #696969;
		margin-bottom: 10rpx;
		text-align: center;
		font-size: 35rpx;
	}
	.broad_title .active{
		color:#000;
		font-weight: 700;
	}
</style>
