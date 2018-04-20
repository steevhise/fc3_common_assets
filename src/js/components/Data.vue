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
			path: { type: Object, default: {} },
			context: { type: String, default: "item" }
		},
		data() {
			return {
				currLimit: this.limit,
				postFilter: null
			}
		},
		created() {
			let self = this;

			this.$root.listView = true;

			this.$root.$on('loadMorePosts', () => {
				self.currLimit += self.limit;
				setTimeout(() => {
					this.$redrawVueMasonry();
				}, 100)
			});

			this.$root.$on('post.filter', (type) => {
				if (self.postFilter == type) {
					self.postFilter = null;
				} else {
					self.postFilter = type;
				}
			});

			this.$root.$on('postViewToggle', () => {
				this.$root.listView = ! this.$root.listView;
			});
		},
		computed: {
			items() {
				let self = this;
				let results = this.$lodash.filter(this.data[this.context], function(item, index) {
					return self.$lodash.inRange( index, 0, self.currLimit )
				});

				if (self.postFilter) {
					results = this.$lodash.filter(results, function(item, index) {
						return item.type.name.toLowerCase() == self.postFilter;
					});
				}

				return results;
			}
		},
		mounted() {
			
		}
	}
</script>