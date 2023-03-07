<template>
	<div class="uni_banner" :class="className">
		<template v-if="data.data && data.data.length > 0">
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular :indicator-dots="options.indicatorDots" :autoplay="options.autoplay"
					:interval="options.interval" :duration="options.duration" :vertical="className=='two'?true:false">
					<swiper-item v-for="(item, index) in data.data" :key="index">
						<image class="swiper_img" mode="scaleToFill" :src="item.url"></image>
					</swiper-item>
				</swiper>
			</view>
		</template>
		<template v-else>
			<div class="image-null"><span class="el-icon-picture"></span></div>
		</template>
	</div>
</template>


<script>
	export default {
		name: 'UniBanner',
		props: ['data', 'className'],
		computed: {
			options () {
				// console.log(this.data, this.className);
				return this.data.options
			},
		}
	}
</script>


<style lang='scss'>
	.uni_banner {
		.uni-margin-wrap {
			width: 690rpx;
			width: 100%;
		}
		.swiper {
			height: 300rpx;
		}
		.swiper-item {
			display: block;
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
		}
		.swiper_img {
			width: 100%;
			height: 300px;
		}
		.image-null {
			background: #ffffff;
			height: 200px;
			font-size: 50px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #c1c1c1;
			width: 100%;
		}
	}
</style>