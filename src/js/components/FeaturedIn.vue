<template>
	<!-- This should be in fc3_main -->
	<div id="fc-featuredin">
		<div v-for="(feature, index) in randomFeatures" :key="index" v-if="index < 4" class="columns medium-3 small-6" >
			<img :src="`/images/${feature}.png`" :title="format(feature)" :alt="format(feature)" >
		</div>
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
		methods: {
			// format the feature for title and alt attributes
			// this is a good practice for accessibility compliance and SEO
			format(str) {
				return str.replace('_', ' ').toUpperCase();
			}
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
		display: flex;
	}
	#fc-featuredin img {
	}
</style>