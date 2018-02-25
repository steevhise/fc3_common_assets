<template>
	<div id="fc-featuredin">
		<img v-for="(feature, index) in randomFeatures" :key="index" v-if="index < 4" :src="`/images/${feature}.png`" class="columns medium-3" >
	</div>
</template>

<script>
	export default {
		name: 'fc-featuredin',
		data() {
			return {
				features: [
					'abc_nightline', 'cnn', 'esquire', 'nbc_today',
					'newsweek', 'newyorktimes', 'parade', 'time', 'people',
					'time', 'wallstreet', 'yahoo'
				]
			}
		},
		mounted() {
			
		},
		computed: {
			randomFeatures() {
			let currentIndex = this.features.length, temporaryValue, randomIndex;

			// While there remain elements to shuffle...
			while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = this.features[currentIndex];
				this.features[currentIndex] = this.features[randomIndex];
				this.features[randomIndex] = temporaryValue;
			}

			return this.features;
			}
		}
	}
</script>

<style scoped>
	#fc-featuredin {
		text-align: center;
	}
	#fc-featuredin img {
		width: 300px !important;
	}
</style>