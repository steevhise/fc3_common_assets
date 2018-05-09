<template>
	<div id="fc-data">
		<component :is="component" v-for="(item, index) in items" :key="item.id" :path="path" :item="item" :index="index" :viewer="viewer" v-on:post-deleted="removeItem(index)" ></component>
	</div>
</template>

<script>
	export default {
		name : 'fc-data',
		props : {
			limit: { type: Number, default: 10 },
			component: { type: String, required: true },
			data: { type: Object, default: {} },
			viewer: { type: Number, default: 0 },
			path: { type: Object, default: {} },
			context: { type: String, default: "item" }
		},
		data() {
			return {
				currLimit: this.limit,
				postFilter: null,
				selectedTags: [],
				deletedPosts: []
			}
		},
		created() {
			let self = this;

			this.$root.listView = true;

			this.$root.$on('redrawVueMasonry', () => {
				setTimeout(() => {
					this.$redrawVueMasonry();
				}, 100)
			});

			this.$root.$on('loadMorePosts', () => {
				self.currLimit += self.limit;
				self.$root.$emit('redrawVueMasonry');
			});

			this.$root.$on('postViewToggle', () => {
				this.$root.listView = ! this.$root.listView;
			});

			this.$root.$on('handlePostFilter', (type) => {
				if (type == this.$root.posts.filter) {
					this.$root.posts.filter = null;
				} else {
					this.$root.posts.filter = type;
				}
			});
		},
		computed: {
			items() {
				let self = this;
				let results = [];
				let currentPosts = this.$lodash.filter(self.data.posts, function(item, index) {
					return !self.deletedPosts.includes(item.id);
				});

				results = this.$lodash.filter(currentPosts, function(item, index) {
					return self.$lodash.inRange( index, 0, self.currLimit );
				});

				if (self.$root.posts.filter) {
					results = this.$lodash.filter(currentPosts, function(item, index) {
						return item.type.name.toLowerCase() == self.$root.posts.filter;
					});
				}

				if (self.selectedTags.length > 0) {
					results = this.$lodash.filter(currentPosts, function(item, index) {
						return self.$findOne(self.$lodash.values(self.selectedTags), self.$lodash.values(self.$lodash.mapValues(item.tags, 'name')));
					})
				}

				self.$root.$emit('redrawVueMasonry');
				return results;
			}
		},
		methods: {
			// TODO Might work as inline call, but separated here just for clarity (avoiding longish attribute content for v-on)
			removeItem: function (index) {
				// change to component data triggers re-compute of items
				this.deletedPosts.push(this.items[index].id);
			}
		},
		mounted() {
			let self = this;

			window.$('.tag-select').on('change', function() {
				self.selectedTags = window.$('.tag-select').val();
				self.$emit('redrawVueMasonry');
			});
		}
	}
</script>
