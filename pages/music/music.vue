<template>
	<view class="music" v-if="song[0]">
		<view class="music_title">
			<text class="iconfont icon-shangyige" style="position: absolute;left: 0;" @click="pull"></text>
			<view class="music_titleSong">
				<view class="music_titleAnimate">
					<view :class="song[0].name.length < 14 ? '' : 'music_titleAnimateLoop'">{{song[0].name}}</view>
				</view>
				<view>{{song[0].ar[0].name}} ></view>
			</view>
			<text class="iconfont icon-share" style="position: absolute;right: 0;"></text>
		</view>
		
		<view class="music_container">
			<image class="music_needle" :class="isPlayNeedle" src="/static/images/song/needle.png"/></image>
			<view class="music_discContainer" :class="isPlayDisc">
				<image class="music_dic" src="/static/images/song/disc.png"/>
				<image class="music_dicImg" :src="song[0].al.picUrl"/>
			</view>
		</view>
		
		<view style="display: flex;justify-content: center;">
			<view class="control-process">
				<text>{{currentTime}}</text>
				<slider class="slider"
					@change="sliderChange"
					@touchstart="sliderMoveStart"
					@touchend="sliderMoveEnd" 
					min="0" 
					block-size="16" 
					max="100"
					activeColor="rgb(240, 19, 19)" 
					backgroundColor="rgba(255,255,255,.3)" 
					:value="sliderValue"
				/>
				<text>{{durationTime}}</text>
			</view>
		</view>
		
		<view class="music_control">
			<text :class="chooseMode" @click="handleChange"></text>
			<text class="iconfont icon-lastSong" id="pre" @click="handleSwitch"></text>
			<text :class="isPlayMusic" class="big" @click="musicPlay"></text>
			<text class="iconfont icon-nextSong" id="next" @click="handleSwitch"></text>
			<text class="iconfont icon-playList" @click="toPlayRecently"></text>
		</view>
		<view v-if="isShow" style="display: flex;align-items: center;justify-content: center;z-index: -999 ;">
			<play-recently :playRecentlyId="playRecentlyIdList"></play-recently>
		</view>
	</view>
</template>

<script>
	import playRecently from './playRecently/playRecently.vue'
	
	import request from 'utils/request.js'
	
	const app = getApp();
	const backgroundAudioManager = uni.getBackgroundAudioManager();
	let _musicLink = '';
	let _durationTimeNum = 0;
	let _playMode = {
			sequence:0,
			random:1,
			loop:2,
		};
	let _isMovingSlider = false;
	let _musicIdList = [];
	export default {
		data() {
			return {
				song: {},//歌曲详情,
				musicId:'',//音乐id
				isPlay: false,
				mode: 0,
				currentTime: '00:00',
				durationTime: '00:00',
				isShow:false,
				playRecentlyIdList: [],
				isRandom:false,
				isloop:false,
				sliderValue:0,
			}
		},
		onLoad(options) {
			let musicId = this.musicId = options.musicId
			this.getMusicInfo(musicId);
			//判断当前页面音乐是否在播放
			if(app.globalData.isMusicPlay && String(app.globalData.musicId) === this.musicId){
				this.isPlay = true
			}
			this.mode = app.globalData.playwaynum
			console.log(app.globalData.musicIdList)
			this.playRecentlyIdList =_musicIdList = app.globalData.musicIdList
			//判断播放顺序
			switch(this.mode) {
				case 1:
					this.isRandom=false
					this.isloop=false
				break;
				case 2:
					this.isRandom=true
					this.isloop=false
				break;
				case 3:
					this.isRandom=false
					this.isloop=true
				break;
			}
		},
		methods: {
			async getMusicInfo(musicId){
				let songData = await request('/song/detail',{ids:musicId});
				this.song = songData.songs
				// 悬浮播放器信息
				let musicInfo = {
					isPlay: app.globalData.isMusicPlay,
					song : songData.songs[0],
					musicId,
				}
				uni.$emit('musicBottom',{
					msg:musicInfo
				})
				_durationTimeNum = songData.songs[0].dt;
				this.durationTime = String(this.handleTime(_durationTimeNum));
			},
			musicPlay(){
				this.isPlay = !this.isPlay;
				app.globalData.isMusicPlay = this.isPlay
				let {musicId,isPlay} = this.$data
				this.musicControl(musicId, isPlay, _musicLink)
			},
			async musicControl(musicId, isPlay, musicLink){
				if(isPlay){
					app.globalData.isMusicPlay = true
					if(!musicLink || app.globalData.musicId !== musicId){
						//获取播放链接
						let musicLinkData = await request('/song/url',{id:musicId});
						_musicLink = musicLinkData.data[0].url === musicLink ? musicLink: musicLinkData.data[0].url
						if(!_musicLink){
							uni.showToast({
								title: '此曲不可播放,请点击下一曲',
								icon: 'none',
							});
						}
						if(this.isloop){
							backgroundAudioManager.onEnded(() => {
								backgroundAudioManager.src = _musicLink;
								backgroundAudioManager.play()
							})
						}
						backgroundAudioManager.startTime = backgroundAudioManager.currentTime;
					}
					backgroundAudioManager.src = _musicLink;
					backgroundAudioManager.title = this.song[0].name;
					backgroundAudioManager.play();
				}else{
					app.globalData.currentTimeNum = backgroundAudioManager.currentTime;
					backgroundAudioManager.pause();
				}
				
				//监听音乐的播放/暂停/停止/自动完成播放
				backgroundAudioManager.onPlay(() =>{
					app.globalData.isMusicPlay = this.isPlay = true
					app.globalData.musicId = musicId;
					backgroundAudioManager.seek(new Date(app.globalData.currentTimeNum).getMilliseconds())
				});
				backgroundAudioManager.onPause(() => {
					app.globalData.isMusicPlay = this.isPlay = false
				});
				backgroundAudioManager.onEnded(() => {
					this.next(_musicIdList,this.isRandom)
				});
				//监听音乐实时播放的时间
				backgroundAudioManager.onTimeUpdate(() => {
					let currentTimeNum = backgroundAudioManager.currentTime;
					this.sliderValue = currentTimeNum / _durationTimeNum * 1000 * 100
					this.currentTime = String(this.handleTime(currentTimeNum * 1000));
				});
			},
			handleSwitch(e){
				let type = e.currentTarget.id;
				backgroundAudioManager.stop();
				let isRandom = this.isRandom
				switch(type) {
					case "pre":
						this.pre(_musicIdList,isRandom)
					break;
					case "next":
						this.next(_musicIdList,isRandom)
					break;
				}
			},
			//上一曲
			pre(musicIdList,isRandom){
				if(musicIdList.length<2){
					uni.showToast({
						title: '此曲为单曲',
						icon: 'none',
					});					
				}
				else if(isRandom){
					this.handleRandomEvent()
				}
				else{
					let musicId = this.musicId;
					let length = musicIdList.length;
					let index = musicIdList.findIndex(v => v== musicId);
					this.musicId = musicId = index === 0 ? musicIdList[length - 1] : musicIdList[index-1];
					this.getMusicInfo(musicId)
					this.musicControl(musicId,true);
				}
				this.sliderValue = 0;
				this.currentTime = '00:00'
			},
			//下一曲
			next(musicIdList,isRandom){
				if(musicIdList.length<2){
					uni.showToast({
						title: '此曲为单曲',
						icon: 'none',
					});
				}
				else if(isRandom){
				    this.handleRandomEvent()
				}
				else{
					let musicId=this.musicId;
					let length=musicIdList.length;
					let index = musicIdList.findIndex(v => v==musicId);
					this.musicId = musicId = index == length-1 ? musicIdList[0] : musicIdList[index+1];
					this.getMusicInfo(musicId)
					this.musicControl(musicId,true);
				}
				this.sliderValue = 0;
				this.currentTime = '00:00'
			},
			handleChange(){
				let mode = app.globalData.playwaynum = this.mode = (this.mode + 1) % 3;
				switch(mode) {
					case 1:
						mode+=1;
						uni.showToast({
						  title: '随机播放',
						  icon: 'success',
						});
						this.isRandom=true;
						this.isloop=false;
					break;
					case 2:
						mode+=1;
						wx.showToast({
							title: '单曲循环',
							icon: 'success',
						});
						this.isRandom=false;
						this.isloop=true
					break;
					default:
						mode = 1
						uni.showToast({
							title: '列表循环',
							icon: 'success',
						});
						this.isRandom=false;
						this.isloop=false
					break;
				}
			},
			//随机播放事件
			handleRandomEvent(){
				let musicId = this.musicId;
				let musicIdList = _musicIdList
				let length = musicIdList.length;
				let index
				if(length < 2){
					this.musicControl(musicId,true);
					return;
				}
				if(length === 1){
				  musicId = musicIdList[0];
				} else {
					do{
						let range = length - 0;
						let rand = Math.random();
						index = (0 + Math.round(rand * range));
					}
					while ((musicId === musicIdList[index]) || (index >= musicIdList.length)) 
					app.globalData.musicId = musicId = musicIdList[index]
				}
				this.getMusicInfo(musicId)
				this.musicControl(musicId,true);
			},
			handleTime(time){
				let minute = Math.floor(time / 1000 / 60);
				let second = Math.floor(time / 1000 % 60);
				minute = (String(minute).length == 1) ? ('0' + minute): minute;
				second = (String(second).length == 1) ? ('0' + second): second;
				return minute +':'+second;
			},
			sliderChange(e) {
				if(!_isMovingSlider){
					this.sliderValue = e.detail.value
					let position = e.detail.value / 100 * _durationTimeNum
					this.currentTime = String(this.handleTime(position))
					backgroundAudioManager.seek(position / 1000)
				}
			},
			sliderMoveStart(){
				_isMovingSlider: true
			},
			sliderMoveEnd(){
				_isMovingSlider: false
			},
			toPlayRecently(){
				this.isShow = !this.isShow
			},
			pull(){
				uni.navigateBack({
				    delta: 1,
				});
			},
		},
		computed:{
			isPlayNeedle(){
				return this.isPlay && 'music_needleRotate'
			},
			isPlayDisc(){
				return this.isPlay && 'music_discContainerAnimation'
			},
			isPlayMusic(){
				return this.isPlay ? 'iconfont icon-play' : 'iconfont icon-pause'
			},
			chooseMode(){
				return this.mode === _playMode.sequence ? 'iconfont icon-sequence' : this.mode === _playMode.loop ? 'iconfont icon-loop' : 'iconfont icon-random'
			},
		},
		components:{
			playRecently
		}
	}
</script>

<style>
	uni-page-body, body{
		height: 100%;
	}
	.music{
		padding-top: 70rpx;
		height: 85%;
	}
	.music_title{
		background: #000000;
		display: flex;
		align-items: center;
		color: #FFFFFF;
	}
	.music_title text{
		font-size: 50rpx;
	}
	.music_titleSong{
		width: 100%;
		padding: 0 50rpx 0 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.music_titleAnimate{
		width: 300rpx;
		font-size: 40rpx;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		font-weight: 600;
	}
	.music_titleAnimateLoop{
		width: 300rpx;
		font-weight: 600;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		animation: 10s titleSongLoop linear infinite;
	}
	@keyframes titleSongLoop {
		from {
			transform: translateX(290rpx);
		}
		to {
			transform: translateX(-1rpx);
		}
	}

	
	.music_container{
		background-image: linear-gradient(left top,#000000 75%,#7e3f00);
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}
	
	.music_needle{
		z-index: 99;
		position: relative;
		left: 60rpx;
		width: 240rpx;
		height: 180px;
		transform-origin: 40rpx 0;
		transform: rotate(-20deg);
		transition: transform 1s;
	}
	.music_needleRotate{
		transform: rotate(0deg);
	}
	
	.music_discContainer{
		position: relative;
		top: -140rpx;
		width: 598rpx;
		height: 598rpx;
	}
	/* 动画 */
	.music_discContainerAnimation{
		animation: musicDisc 10s linear infinite;
		/* infinite无限循环 */
		animation-delay: 1s;
	}
	@keyframes musicDisc{
		to{
			transform: rotate(360deg);
		}
	}
	
	.music_dic{
		width: 598rpx;
		height: 598rpx;
	}
	.music_dicImg{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
	}
	
	.control-process {
		position: absolute;
		bottom: 150rpx;
		width: 700rpx;
		height: 100rpx;
		line-height: 100rpx;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	}
	.control-process .slider {
		position: relative;
	    width: 526rpx;
	}
	.control-process text {
	    color: #fff;
	}
	
	.music_control{
		background-image: linear-gradient(right top,#7e3f00,#000000 90%);
		position: absolute;
		height: 120rpx;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		color: #000000
	}
	.music_control text{
		width: 20%;
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 50rpx;
	}
	.music_control text.big{
		font-size: 90rpx;
	}
</style>
