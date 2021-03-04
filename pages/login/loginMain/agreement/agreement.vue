<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		onLoad(options) {
			this.url = options.urlId;
			//
			let str = options.titleId
			str = str.replace("《", "");
			str = str.replace("》", "");
			uni.setNavigationBarTitle({
				title: str
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
