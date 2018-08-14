<template>
	<div id="fc-data">
		<fc-lend-friends-select
			v-on:friend-selected="postLent"
		/>
		<fc-lend-message ref="lendMessage"/>
		<component :is="component" v-for="(item, index) in items" :key="item.id" :path="path" :item="item" :index="index" :viewer="viewer"
			v-on:post-deleted="removeItem(index)"
			v-on:post-marked="updatePostType"
			v-on:post-returned="postReturned"
		>
		</component>
	</div>
</template>

<script>
	export default {
		name : 'fc-data',
		props : {
			limit: { type: Number, default: 50 },
			component: { type: String, required: true },
			data: { type: Object, default: {} },
			viewer: { type: Number, default: 0 },
			path: { type: Object, default: {} },
			context: { type: String, default: "item" }
		},
		data() {
			return {
				posts: this.data.posts || [],
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

			// Case where post list starts off with fewer posts than page limit
			if (self.currLimit >= self.posts.length) {
				// hide load more button if all posts are visible
				window.$('#item-list-load-more').hide();
			}

			this.$root.$on('loadMorePosts', () => {
				self.currLimit += self.limit;
				self.$root.$emit('redrawVueMasonry');
				if (self.currLimit >= self.posts.length) {
					window.$('#item-list-load-more').hide();
				}
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

				results = self.$lodash.filter(this.posts, function(item, index) {

					return !self.deletedPosts.includes(item.id);
				});

				results = self.$lodash.filter(results, function(item, index) {
					return self.$lodash.inRange( index, 0, self.currLimit );
				});

				if (self.$root.posts.filter) {
					results = self.$lodash.filter(results, function(item, index) {
						return item.type.name.toLowerCase() == self.$root.posts.filter;
					});
				}

				if (self.selectedTags.length > 0) {
					results = self.$lodash.filter(results, function(item, index) {
						return self.$findOne(self.$lodash.values(self.selectedTags), self.$lodash.values(self.$lodash.mapValues(item.tags, 'name')));
					})
				}

				if (self.$root.posts.selectedTown.length > 0) {
					results = self.$lodash.filter(results, function(item, index) {
						return item.group.name === self.$root.posts.selectedTown;
					})
				}

				self.$root.$emit('redrawVueMasonry');
				return results;
			}
		},
		// Essentially, fake reloads; manually mutate state to reflect actual changes to data we'd receive from server on page reload
		methods: {
			// TODO Might work as inline call, but separated here just for clarity (avoiding longish attribute content for v-on)
			removeItem: function (index) {
				// change to component data triggers re-compute of items
				this.deletedPosts.push(this.items[index].id);
			},
			updatePostType: function ({ type, post }) {

				const { $lodash, posts } = this;
				const matchId = (p) => p.id === post.id;

				post.type = type;
				posts[$lodash.findIndex(posts, matchId)] = post;
				this.$bus.$emit('alert', { level: 'success', message: `<p>Post <strong>${post.subject}</strong> marked as ${type.name}</p>`, timer: 8000 });
			},
			postLent: function({ share, post, threadId }) {

				const { $lodash, posts } = this;
				const matchId = (p) => p.id === post.id;

				// $set / $delete (see postReturned below) must be used for setting / deleting the share property
				// b/c Vue's reactivity system doesn't watch these types of mutations i.e. regular mutation doesn't trigger
				// component rerender
				this.$set(post, 'share', share);
				posts[$lodash.findIndex(posts, matchId)] = post;
				this.$bus.$emit('alert', { level : 'success', message: `You lent <strong>${post.subject}</strong>!`, timer: 20000 });

				this.$refs.lendMessage.post = post;
				this.$refs.lendMessage.lendThreadId = threadId;
				$('#lendMessageTrigger').click(); // open optional lend message form (fc-lend-message)
			},
			postReturned: function({ post }) {

				const { $lodash, posts } = this;
				const matchId = (p) => p.id === post.id;

				this.$delete(post, 'share');
				posts[$lodash.findIndex(posts, matchId)] = post;
				this.$bus.$emit('alert', { level : 'success', message: `<strong>${post.subject}</strong> has been returned!`, timer: 20000 });
			}
		},
		mounted() {
			let self = this;
			this.$root.posts.towns = this.data.towns;
			window.$('.tag-select').on('change', function() {
				self.selectedTags = window.$('.tag-select').val();
				self.$emit('redrawVueMasonry');
			});
		}
	}
</script>
