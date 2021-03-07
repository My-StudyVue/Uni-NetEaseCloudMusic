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
			<view class="music_progress">
				<text>{{currentTime}}</text>
				<view class="music_bar">
					<view class="music_timeBar" :style="{width: currentWidth + 'px'}">
						<view class="music_circle"/>
					</view>
				</view>
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
			<play-recently :playRecently="playRecentlyList"></play-recently>
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
	let playMode = {
			sequence:0,
			loop:1,
			random:2
		};
	export default {
		data() {
			return {
				song: {},//歌曲详情,
				musicId:'',//音乐id
				isPlay: false,
				mode: 0,
				currentTime: '00:00',
				durationTime: '00:00',
				currentWidth: 0,
				isShow:false,
				playRecentlyList: [],
				// playRecentlySongId: '',
			}
		},
		onLoad(options) {
			let musicId = options.musicId
			this.musicId = options.musicId;
			this.getMusicInfo(musicId);
			//判断当前页面音乐是否在播放
			if(app.globalData.isMusicPlay && app.globalData.musicId === musicId){
				this.isPlay = true
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
				uni.$emit('switchType',{
					msg:type
				})
				this.currentWidth = 0;
				this.currentTime = '00:00'
			});
			//监听音乐实时播放的时间
			backgroundAudioManager.onTimeUpdate(() => {
				let currentTimeNum = backgroundAudioManager.currentTime;
				this.currentTime = String(this.handleTime(currentTimeNum * 1000));
				this.currentWidth = (new Date(currentTimeNum).getMilliseconds()) / (new Date(_durationTimeNum).getMilliseconds()) * 430;
			});
		},
		methods: {
			async getMusicInfo(musicId){
				let songData = await request('/song/detail',{ids:musicId});
				this.song = songData.songs
				_durationTimeNum = songData.songs[0].dt;
				this.durationTime = String(this.handleTime(_durationTimeNum));
			},
			musicPlay(){
				this.isPlay = !this.isPlay;
				let {musicId,isPlay} = this.$data
				this.musicControl(musicId, isPlay, _musicLink);
			},
			handleChange(){
				let mode = this.mode = (this.mode + 1) % 3;
				//发布
				// uni.$emit('switchMode',{
				// 	msg:mode
				// })
			},
			async musicControl(musicId, isPlay, musicLink){
				if(isPlay){
					if(!musicLink || _musicLink !== musicLink){
						//获取播放链接
						let musicLinkData = await request('/song/url',{id:musicId});
						_musicLink = musicLinkData.data[0].url;
						backgroundAudioManager.startTime = backgroundAudioManager.currentTime;
					}
					backgroundAudioManager.src = _musicLink;
					backgroundAudioManager.title = this.song[0].name;
					backgroundAudioManager.play();
				}else{
					app.globalData.currentTimeNum = backgroundAudioManager.currentTime;
					backgroundAudioManager.pause();
				}
			},
			handleSwitch(e){
				let type = e.currentTarget.id;
				backgroundAudioManager.stop();
				//订阅(接受)通信---musicId
				uni.$on('musicId',data => {
					this.getMusicInfo(data.msg);
					this.musicControl(data.msg,true);
					//取消订阅(接受)通信---消除累加
					uni.$off('musicId')
				})
				// 发布(传递)通信---type
				uni.$emit('switchType',{
					msg:type
				})
				this.isPlay = true
			},
			handleTime(time){
				let minute = Math.floor(time / 1000 / 60);
				let second = Math.floor(time / 1000 % 60);
				minute = (String(minute).length == 1) ? ('0' + minute): minute;
				second = (String(second).length == 1) ? ('0' + second): second;
				return minute +':'+second;
			},
			toMusicBottom(){
				let musicInfo = {
					song : this.song,
					musicId: this.musicId,
					musicLink: _musicLink,
					currentTime: this.currentTime,
					durationTime: this.durationTime,
				}
				uni.$emit('musicBottom',{
					msg:musicInfo
				})
			},
			toPlayRecently(){
				this.isShow = !this.isShow
			},
			pull(){
				uni.navigateBack({
				    delta: 1
				});
			}
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
				return this.mode === playMode.sequence ? 'iconfont icon-sequence' : this.mode === playMode.loop ? 'iconfont icon-loop' : 'iconfont icon-random'
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
	
	.music_progress{
		color: #fff;
		position: absolute;
		bottom: 150rpx;
		width: 700rpx;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
	}
	.music_progress .music_bar{
		position: relative;
		width: 450rpx;
		height: 4rpx;
		background: #d9d9d9;
		margin: auto;
	}
	.music_progress .music_bar .music_timeBar{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		height: 4rpx;
		background: rgb(240, 19, 19);
	}
	.music_progress .music_bar .music_timeBar .music_circle{
		position: absolute;
		right: -12rpx;
		top:-6rpx;
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background: #fff;
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
