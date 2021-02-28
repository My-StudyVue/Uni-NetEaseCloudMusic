<template>
	<view class="search">
		<view class="header">
			<view class="searchInput">
				<text class="iconfont icon-search"/>
				<input :value="searchContent"
					   :placeholder="searchDefault"
					   :focus="showSync"
					   @input="handleInputChange"/>
				<text v-show="searchContent" class="iconfont icon-quxiao" @click="clear"/>
			</view>
			<text class="cancel" @click="cancel">取消</text>
		</view>
		<block v-if="searchList.length">
			<view class="showSearchContent">
				<view class="searchContent">搜索内容:“{{searchContent}}”</view>
				<view class="searchList">
					<view class="searchItem"
						  v-for="item in searchList" 
						  :key="item.id" 
						  @click="toSearchDetail(item.name)">
						<text class="iconfont icon-search"/>
						<text class="content">{{item.name}}</text>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="history" v-if="historyList.length">
				<view class="title">
					<text style="font-size: 30rpx;font-weight: 600;margin-right: 490rpx;">历史记录</text>
					<text class="iconfont icon-lajixiang" style="font-size: 40rpx;" @click="deleteHistory"/>
				</view>
				<view class="historyList">
					<view class="historyItem" v-for="(item, index) in historyList" :key="index">{{item}}</view>
				</view>
			</view>
			<view class="container">
				<view class="title">热搜榜</view>
				<view class="hotList"
					  v-for="(item,index) in hostList" 
					  :key="index" 
					  @click="toSearchDetail(item.searchWord)">
					<text class="order" :style="{'color': index < 3 ? 'rgb(240, 19, 19)' : ''}">{{index + 1}}</text>
					<view style="width: 500rpx;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						<view>
							<text :style="{'color': index < 3 ? 'rgb(240, 19, 19)' : ''}">{{item.searchWord}}</text>
							<image v-show="item.iconUrl" :src="item.iconUrl" style="width: 30rpx;height: 30rpx;margin-left: 10rpx;"></image>
						</view>
						<text style="font-weight: 200;font-size: 25rpx;">{{item.content}}</text>
					</view>
					<text style="width: 42rpx;font-weight: 200;font-size: 28rpx;float: right;color: #c5c5c5;">{{item.score}}</text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import request from 'utils/request.js'
	
	let isSend = false;//函数节流使用
	
	export default {
		data() {
			return {
				searchDefault: '', //placeholder内容
				hostList: [], //热搜榜数据
				searchContent: '', //input数据
				historyContent: '',
				searchList: [], //关键字模糊匹配数据
				historyList: [], //搜索历史记录
				color: '',
				showSync: false,
			}
		},
		mounted() {
			this.getInitData()
			this.getSearchHistory()
		},
		methods: {
			async getInitData(){
				this.$nextTick(() => {
					this.showSync = true;
				})
				let searchDefaultData = await request('/search/default');
				let hostListData = await request('/search/hot/detail');
				this.searchDefault = searchDefaultData.data.showKeyword;
				this.hostList = hostListData.data
			},
			clear(){
				this.searchContent = '';
				this.searchList = [];
			},
			cancel(){
				uni.navigateBack({
					delta:1
				})
			},
			deleteHistory(){
				uni.showModal({
					content: '确认删除吗？',
					success: (res) => {
						if(res.confirm){
							this.historyList = [],
							uni.removeStorageSync('serchHistoty')
						}
					}
				})
			},
			handleInputChange(e){
				this.searchContent = e.detail.value.trim()
				if(this.searchContent){
					if(isSend){
						return 
					}
					isSend = true
					this.getSearchList()
					//函数节流
					setTimeout(() => {
						isSend = false;
					},300)
				}
			},
			async getSearchList(){
				if(!this.searchContent){
					this.searchList = [];
					return
				}
				let {searchContent, historyList} = this.$data
				let searchListData = await request('/cloudsearch',{keywords:searchContent, limit:10})
				this.searchList = searchListData.result.songs
				//添加到历史记录中
				if(historyList.indexOf(searchContent) !== -1){
					historyList.splice(historyList.indexOf(searchContent), 1)
				} 
				historyList.unshift(searchContent)
				uni.setStorageSync('serchHistoty', historyList)
			},
			getSearchHistory(){
				let historyList = uni.getStorageSync('serchHistoty')
				if(historyList){
					this.historyList = historyList
				}
			},
			toSearchDetail(songName){
				uni.navigateTo({
					url:'./searchDetail?keyWords=' + songName
				})
			}
		}
	}
</script>

<style>
	.search{
		padding: 30rpx;
	}
	
	.header{
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
	}
	.header .searchInput{
		position: relative;
		flex: 1;
		background: rgba(237,237,237, .3);
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		color: rgb(138, 138, 138);
	}
	.header .searchInput .icon-search{
		font-size: 40rpx;
		margin: 0 20rpx 0 20rpx;
	}
	.header .searchInput .icon-quxiao{
		position: absolute;
		right: 20rpx;
		font-size: 40rpx;
		font-weight: 600;
	}
	.header .cancel{
		font-size: 35rpx;
		font-weight: 600;
		text-align: center;
		margin-left: 10rpx;
	}
	
	.showSearchContent .searchContent{
		color: rgba(0, 85, 255, 0.9);
		line-height: 80rpx;
		font-size: 30rpx;
		border-bottom: 1rpx solid rgb(240, 19, 19);
	}
	.showSearchContent .searchItem{
		line-height: 80rpx;
		display: flex;
	}
	.showSearchContent .searchItem .content{
		flex: 1;
		margin-left: 20rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.history{
		line-height: 50rpx;
		margin: 20rpx 0;
	}
	.history .historyList{
		display: flex;
		flex-wrap: wrap;
	}
	.history .historyList .historyItem{
		font-size: 28rpx;
		background: #ededed;
		margin: 5rpx 20rpx;
		padding: 0 30rpx;
		border-radius: 20rpx;
	}
	
	.container{
		font-weight: 600;
	}
	.container .title{
		font-size: 30rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #eee;
	}
	.container .hotList{
		line-height: 50rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 0 10rpx 0;
	}
	.container .hotList .order{
		margin: 0 30rpx 0 20rpx;
	}
</style>
