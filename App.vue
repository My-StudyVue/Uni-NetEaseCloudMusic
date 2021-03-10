<script>
export default {
	globalData: {//全局标识
		isMusicPlay: false,
		musicId: '',
		playIdList:[],
		currentTimeNum: 0,
		userInfo1:uni.getStorageSync('userInfo1'),
		userInfo2:uni.getStorageSync('userInfo2'),
		userInfo3:uni.getStorageSync('userInfo3'),
	},
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
	@import url('/static/iconfont/iconfont.css');
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
