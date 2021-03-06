<template>
   <view>
	 <view class="broad_title">
	 	<view :class="{ 'active': index == tab }"
	 		  v-for="(item,index) in tabList" 
	 		  :key="index"
	 		  @click="clickTab(index)">
	 		<text v-text="item.title" style="padding: 0 10rpx;"/>
	 	</view>
	 </view>
     <scroll-view 
     class="broad_container" 
     scroll-x="true">
         <view  class="broad_container_item" 
				v-for="item in broad[tab]"
		 		:key="item.id">
				<image :src="item.picUrl" style="width: 250rpx;height: 250rpx;border-radius: 50%;">
					<view class="broad_container_title">{{item.name}}</view>
				</image>
         </view>
     </scroll-view>
   </view>
</template>
 
<script>
	export default{
		data(){
			return{
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
				]
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
 
<style scoped>
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
	
	.broad_container{
	  white-space: nowrap;
	  overflow: hidden;
	  width: 100%;
	  height: 330rpx;
	}
	.broad_container_item{
	  width: 280rpx;
	  height: 200rpx;
	  display: inline-block;
	  margin: 0 20rpx;
	}
	.broad_container_title{
		align-items: center;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		width: 250rpx;
	}
</style>