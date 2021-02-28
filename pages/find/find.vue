<template>
	<view class="container">
		<!-- 祖孙传值 -->
		<banner v-bind="$attrs"></banner>
		<redIcon></redIcon>
		<recommend v-bind="$attrs"></recommend>
		<chart v-bind="$attrs"></chart>
	</view>
</template>

<script>
import banner from 'components/findComponents/banner/banner.vue'
import redIcon from 'components/findComponents/redIcon/redIcon.vue'
import recommend from 'components/findComponents/recommend/recommend.vue'
import chart from 'components/findComponents/chart/chart.vue'

	export default {
		data() {
			return {
			}
		},
		methods: {
			
		},
		components:{
			banner,
			redIcon,
			recommend,
			chart
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>