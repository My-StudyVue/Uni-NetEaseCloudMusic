<template>
	<view class="musicBottom">
		<image :src="src" style="width: 100rpx;height: 100rpx;border-radius: 50%;"></image>
		<view class="music">
			<text style="font-weight: 700;"
				  :class="title.length < 14 ? 'music_titleAnimate' : 'music_titleAnimateLoop'">{{title}}</text>
			<text class="author">{{author}}</text>
		</view>
		<view style="display: flex;justify-content: center;align-items: center;">
			<view :class="isPlayMusic" @click="musicPlay"></view>
			<canvas class="music_progress" canvas-id="bar"></canvas>
			<canvas class="music_progress" canvas-id="timeBar"></canvas>
		</view>
		<text class="iconfont icon-playList"></text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'http://p2.music.126.net/r6oGHnznNVB4sSVjRxdz2g==/109951165463882412.jpg?param=130y130',
				title: 'hhh',
				author: 'xxx',
				isPlay: false,
			}
		},
		mounted() {
			this.drawProgressbar();
			uni.$on('musicBottom',(data) => {
				console.log(data.msg);
			})
		},
		methods: {
			musicPlay(){
				this.isPlay = !this.isPlay;
			},
			 // 绘制路径线
            drawProgressbar() {
				const ctx = uni.createCanvasContext('bar', this);
				ctx.setLineWidth(4);
				ctx.setStrokeStyle('#BFBFBF');
				ctx.beginPath();
				ctx.arc(26, 28, 16, 0, 2 * Math.PI);
                ctx.stroke(); 
                ctx.draw();
				this.drawProgressTimeBar(0.5);
            },
			// 动态绘制圆环
            drawProgressTimeBar(step) {
                var ctx = uni.createCanvasContext('timeBar', this);
                ctx.setLineWidth(4);
                ctx.setStrokeStyle('rgb(240, 19, 19)');
                ctx.setLineCap('round');
                ctx.beginPath();
                ctx.arc(26, 28, 16, 1.5 * Math.PI, (step + 1.5) * Math.PI);
                ctx.stroke();
                ctx.draw();
            },
		},
		computed: {
			isPlayMusic(){
				return this.isPlay ? 'iconfont icon-play' : 'iconfont icon-pause'
			}
		}
	}
</script>

<style>
	.musicBottom{
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10rpx;
	}
	
	.music{
		width: 450rpx;
		display: flex;
		flex-direction: column;
		padding-left: 10rpx;
	}
	.music text{
		height: 50rpx;
		line-height: 50rpx;
		max-width: 450rpx;
		white-space: normal;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.music_titleAnimate{
		font-size: 40rpx;
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
	.music_progress{
		position: absolute;
        top: 0;
        right: 70rpx;
        width: 50px;
        height: 50px;
	}
	.iconfont{
		z-index: 1;
		font-size: 65rpx;
		margin: 0 5rpx 0 5rpx;
	}
</style>

