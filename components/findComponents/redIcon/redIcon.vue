<template>
	<view class="redIcon">
		<view v-for="(item,index) in redIcon" 
				:key="index" 
				class="redIcon_item"
				@tap="icon(index)">
				<text :class="item.iconUrl"/>
				<text>{{item.title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				redIcon:[
					{
						iconUrl:'iconfont icon-00',
						title:'每日推荐'
					},
					{
						iconUrl:'iconfont icon-01',
						title:'歌单'
					},
					{
						iconUrl:'iconfont icon-02',
						title:'排行榜'
					},
					{
						iconUrl:'iconfont icon-03',
						title:'电台'
					},
					{
						iconUrl:'iconfont icon-04',
						title:'数字专辑'
					},
				]
			}
		},
		methods: {
			icon(id){
				if(id == 0){
					uni.navigateTo({
						url:'/components/findComponents/redIcon/everdaySong/everdaySong'
					})
				}
			},
		}
	}
</script>

<style>
	.redIcon{
		padding: 30rpx 30rpx 0 30rpx;
		display: flex;
		justify-content: space-between;
	}
	.redIcon_item{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 20rpx;
	}
	
	.iconfont{
		width: 80rpx;
		height: 80rpx;
		color: #FFFFFF;
		border-radius: 50%;
		text-align: center;
		line-height: 80rpx;
		font-size: 50rpx;
		background: rgb(240, 19, 19);
	}
</style>
