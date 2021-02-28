<template>
	<view class="my">
		<view class="my_box"
			:style="{
				backgroundImage: 'url(' + (userInfo.backgroundUrl ? userInfo.backgroundUrl : baseImg) + ')',
				backgroundSize:'100%',
				borderRadius: '25rpx',}">
			<view class="my_title">
				<image
					:src="userInfo.avatarUrl ? userInfo.avatarUrl : src" 
					style="width: 100rpx;height: 100rpx;border-radius: 50%;border: 2rpx solid #fff;" 
					@tap="login"
					/>
				<view class="my_titleName">
					<text>{{userInfo.nickname ? userInfo.nickname : 'userName'}}</text>
					<view style="display: flex;">
						<image src="/static/images/user/grade.png" style="width: 70rpx;height: 35rpx;padding-right: 10rpx;"></image>
						<view style="background: #fff;border-radius: 10rpx;font-size: 27rpx;padding: 0 10rpx 0 10rpx;">Lv.{{level}}</view>
					</view>
				</view>
				<view class="iconfont icon-xiayige" @click="logout"/>
			</view>
			<view class="my_likeContainer" 
				  v-if="playlist.length"
				  @click="toPlayList(playLickList.id)">
				<view class="my_like">
					<text class="iconfont icon-like"/>
				</view>
				<view class="my_likeTitle">
					我喜欢的音乐
					<text>{{playLickList.trackCount}}首</text>
				</view>
				<view style="display: flex;align-items: center;">
					<view class="my_LikeHeart">
						<text class="iconfont icon-heartBeat"/>
						<text>心动模式</text>
					</view>
				</view>
			</view>
		</view>
		<view 
			class="my_songContainer"
			:style="{
				transform:coverTransform,
				transition:coverTransition}"
			@touchstart="handleTouchStart"
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd">
			<view class="my_songTitle">
				<scroll-view 
							 :class="{ 'active': index == tab }"
							 v-for="(item,index) in tabList" 
							 :key="index"
							 @click="clickTab(index)"
							 :style="{'width': index===1 ? '10rpx': ''}">
					<text v-text="item.title"/>
				</scroll-view>
			</view>
			<scroll-view 
				class="my_songList"
				scroll-y
				:scroll-top="scrollTop"
				:scroll-into-view="toView"
				scroll-with-animation
				@scroll="scroll">
				<song-list id="view0" class="item" :songList="myPlaylist" :title="tabList[0].title"></song-list>
				<song-list id="view2" class="item" :songList="otherPlayList" :title="tabList[2].title"></song-list>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import songList from 'pages/my/songList.vue'
	
	import request from 'utils/request.js'
	
	let startY = 0;
	let moveY = 0;
	let moveDistance = 0;
	export default {
		data() {
			return {
				baseImg:'/static/images/user/base.png',
				src:'/static/images/user/user.png',
				userInfo:{},//用户信息
				coverTransform:'translateY(0)',
				coverTransition:'',
				tab:0,
				tabList:[
					{
						title:'创建歌单',
					},
					{
						title:'|',
					},
					{
						title:'收藏歌单',
					},
				],
				level: 0,//等级
				scrollTop: 0,
				toView: '',
				current_id: 2, // 当前id
				playLickList: [],
				playlist: [],
				myPlaylist: [],
				otherPlayList: [],
			}
		},
		mounted(e) {
			//读取用户基本信息
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo){
				//更新userInfo的状态
				this.userInfo = JSON.parse(userInfo)
				this.getLevel();
				let uid = this.userInfo.userId
				this.getSongList(uid)
			}
		},
		methods: {
			handleTouchStart(e){
				this.coverTransform = '',
				startY = e.touches[0].clientY;
			},
			handleTouchMove(e){
				moveY = e.touches[0].clientY;
				moveDistance = moveY - startY;
				if(moveDistance <= 0){
					return 
				}
				if(moveDistance >= 200){
					moveDistance = 200
				}
				this.coverTransform = `translateY(${moveDistance}rpx)`
			},
			handleTouchEnd(){
				this.coverTransform = `translateY(0)`;
				this.coverTransition = `transform 1s linear`
			},
			//
			clickTab(current){
				if(current == 0 || current == 2){
					this.tab = current
				}
				this.toView = 'view' + this.tab
			},
			login(){
				if(!this.userInfo.nickname){
					uni.navigateTo({
						url:'/components/login/loginMain/loginMain'
					})
				}
			},
			logout(){
				uni.showModal({
					content: '确定退出登录吗？',
					success:(res) => {
						if(res.confirm){
							// request('/logout');
							// this.userInfo = {}
						}
					}
				})
			},
			async getLevel(){
				let levelData = await request('/user/level');
				this.level = levelData.data.level
			},
			async getSongList(uid){
				let playListData = await request('/user/playlist',{uid})
				this.playLickList = playListData.playlist[0]
				this.playlist = playListData.playlist.slice(1)
				this.playlist.map(item => {
					if(item.creator.userId === uid){
						this.myPlaylist.push(item)
					}else{
						this.otherPlayList.push(item)
					}
				})
			},
			toPlayList(playListId){
				uni.navigateTo({
					url:'/components/music/playList/playList?playListId=' + playListId
				})
			},
			scroll(e){
				if(e.detail.scrollTop === 0){
					this.tab = 0
				} else if(e.detail.scrollTop === 445){
					this.tab = 2
				}
			},
		},
		components:{
			songList
		}
	}
</script>

<style>
	.my{
		height: 100%;
		background: #F1F1F1;
		border-radius: 25rpx;
		margin-top: 66rpx;
	}
	
	.my_box{
		left: 0;
		right: 0;
		top: 0;
		position: relative;
		z-index: 1;
		display: flex; 
		flex-direction: column;
		height: 700rpx;
	}
	.my_title{
		display: flex;
		align-items: center;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
	}
	.my_titleName{
		display: flex;
		flex-direction: column;
		width: 80%;
		padding-left: 20rpx;
	}  
	
	.my_likeContainer{
		margin: 20rpx 20rpx 20rpx 20rpx;
		height: 100rpx;
		display: flex;
	}
	.my_like{
		width: 100rpx;
		background: #f9f9f9;
		border-radius: 25rpx;
		margin-right: 20rpx;
	}
	.my_like .iconfont{
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgb(240, 19, 19);
		font-size: 70rpx;
	}
	.my_likeTitle{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.my_likeTitle text{
		color: #a3a3a3;
		font-size: 27rpx;
	}
	.my_LikeHeart{
		display: flex;
		align-items: center;
		margin-left: 190rpx;
		border: 3rpx solid #d4d4d4;
		border-radius: 50rpx;
		width: 150rpx;
		height: 50rpx;
		font-size: 25rpx;
	}
	.my_LikeHeart .iconfont{
		font-size: 40rpx;
		color: rgb(240, 19, 19);
	}
	
	.my_songContainer{
		left: 16rpx;
		right: 16rpx;
		top: 400rpx;
		z-index: 2;
		position: absolute;
		display: flex;
		flex-direction: column;
		width: 720rpx;
		height: 100%;
	}
	.my_songTitle{
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		color: #696969;
		margin-bottom: 10rpx;
		text-align: center;
	}
	.my_songTitle .active{
		color:#000;
		font-weight: 700;
		border-bottom: 1rpx solid rgb(240, 19, 19);
		border-width: 5rpx;
	}
	
	.my_songList{
		margin-top: 5rpx;
		height: 1500rpx;
		color: #fff;
	}
	.my_songList .item{
		height: 1500rpx;
		margin-bottom: 30rpx;
		background: #4e789f;
		border-radius: 40rpx;
		padding: 30rpx;
	}
</style>
