<template>
	<div id="fc-data">
		<component :is="component" v-for="(item, index) in items" :key="index" :path="path" :item="item" :index="index" ></component>
	</div>
</template>

<script>
	export default {
		name : 'fc-data',
		props : {
			limit: { type: Number, default: 10 },
			component: { type: String, required: true },
			data: { type: Object, default: {} },
			path: { type: Array, default: {} },
			context: { type: String, default: "item" }
		},
		data() {
			return {
				currLimit: this.limit
			}
		},
		created() {
			let self = this;
			this.$root.$on('loadMorePosts', () => {
				self.currLimit += self.limit;
			});
		},
		computed: {
			items() {
				let self = this;
				let results = this.$lodash.filter(this.data[this.context], function(item, index) {
					return self.$lodash.inRange( index, 0, self.currLimit )
				})

				return results;
			}
		},
		mounted() {
			
		}
	}
</script>