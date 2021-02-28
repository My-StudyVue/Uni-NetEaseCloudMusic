<template>
	<view class="searchDetail">
		<view class="tabTop">
			<view :class="{ 'active': index == tab }" v-for="(item,index) in tabList" :key="index" @click="clickTab(index)">
				<text v-text="item.title"/>
			</view>
		</view>
		<view class="content" v-show="tab === 0">
			<all :all="ALLTypeList"></all>
		</view>
		<view class="content" v-show="tab === 1">
			<ballad :ballad="keyWords"></ballad>
		</view>
		<view class="content" v-show="tab === 2">
			<musicList :musicList="keyWords"></musicList>
		</view>
	</view>
</template>

<script>
	import all from './serchDetailInfo/all.vue'
	import ballad from './serchDetailInfo/ballad.vue'
	import musicList from './serchDetailInfo/musicList.vue'
	
	import request from 'utils/request.js'
	
	export default {
		data(){
			return {
				tab: 0,
				tabList:[
					{
						title:'综合',
					},
					{
						title:'单曲',
					},
					{
						title:'歌单',
					},
				],
				ALLTypeList:[],
				keyWords: '',
			}
		},
		onLoad(option) {
			this.keyWords = option.keyWords
			uni.setNavigationBarTitle({
				title: option.keyWords + ' 的搜索结果'
			});
			this.getSearchResult(option.keyWords)
		},
		methods:{
			clickTab(current){
				this.tab = current
			},
			getSearchResult(keywords){
				[1,1000].map(async item => {
					let typeItem = await request('/cloudsearch',{keywords, limit:5, type:item})
					this.ALLTypeList.push(typeItem.result)
				})
			}
		},
		components:{
			all,
			ballad,
			musicList
		}
	}
</script>

<style>
	.tabTop{
		height: 70rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		color: #696969;
	}
	.tabTop .active{
		color:#000000;
		font-weight: 700;
		border-bottom: 1rpx solid rgb(240, 19, 19);
		border-width: 5rpx;
	}
	.content{
		height: 100%;
		background: #d9d9d9;
	}
</style>
