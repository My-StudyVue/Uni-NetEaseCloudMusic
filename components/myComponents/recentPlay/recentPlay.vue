<template>
	<view class="recent">
		<view class="recent_title">
			<view 
				:class="{ 'title_active': index == tab }"
				v-for="(item,index) in recent" 
				:key="index"
				@click="clickTab(index)">
				<view>{{item}}{{count}}</view>
			</view>
		</view>
		<view class="content" v-show="tab === 0">
			<recentSong></recentSong>
		</view>
		<view class="content" v-show="tab === 1">
			歌单
		</view>
		<view class="content" v-show="tab === 2">
			专辑
		</view>
		<view class="content" v-show="tab === 3">
			电台
		</view>
	</view>
</template>

<script>
	import recentSong from './recentSong.vue'
	export default {
		data() {
			return {
				tab:0,
				recent:['歌曲','歌单','专辑','电台'],
				count:0
			}
		},
		methods: {
			clickTab(ctCur){
				this.tab = ctCur
			}
		},
		components:{
			recentSong
		}
	}
</script>

<style>
	.recent{
		padding-left: 1rem;
		padding-right: 1rem;
	}
	
	.recent_title{
		display: flex;
		justify-content: space-between;
	}
	.recent_title .title_active{
		font-weight: 700;
		border-bottom: 1rpx solid rgb(240, 19, 19);
		border-width: 5rpx;
	}
</style>
