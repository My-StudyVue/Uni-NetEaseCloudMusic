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
		<swiper class="broad_container" display-multiple-items="2">
			<swiper-item v-for="item in broad[tab]"
						 :key="item.id" 
						 style="width: 200rpx;">
				<image :src="item.picUrl" style="width: 250rpx;height: 250rpx;border-radius: 50%;">
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
						title:'热门电台',
					},
					{
						title:'|',
					},
					{
						title:'个性化推荐',
					},
				],
			}
		},
		props:{
			broad:Array
		},
		mounted() {
			console.log(this.broad,this.tab)
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
	/* .broad_container{
		display: flex;
		align-items: center;
	} */
	.broad_container_title{
		display: flex;
		align-items: center;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		/* font-size: 12px; */
		width: 250rpx;
	}
	
	swiper{
		height: 190px;
	}
	
	swiper-item{
	    width: 160px !important;
		transform: translate3d(0px, 0px, 0px);
	}
</style>
