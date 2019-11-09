<template>
	<div id="fc-data">
		<fc-lend-friends-select
			v-on:friend-selected="postLent"
		/>
		<fc-lend-message ref="lendMessage"/>
		<component :is="component" v-for="(item, index) in items" :key="item.id" :path="path" :blocked-users=blockedUsers :item="item" :index="index" :viewer="viewer" :isMember="isMember" :route="route"
			v-on:post-deleted="removeItem(index)"
			v-on:post-marked="updatePostType"
			v-on:post-returned="postReturned"
		>
		</component>
		<span>total: {{ count }} | items: {{ items.length }} displaying: {{ currLimit }} | display limit: {{ limit }} | offset: {{ offset }} | backendLimit: {{ backendLimit }}</span>
	</div>
</template>

<script>
	import axios from 'axios';

	export default {
		name : 'fc-data',
		props : {
			limit: { type: Number, default: 25 },			// this is how many we load onto visible page at a time.
			backendLimit: { type: Number, default: 50 },     // this is how many we get from api endpoint
			component: { type: String, required: true },
			data: { type: Object, default: {} },				// this doesn't change... no props should change
			circle: { type: String, default: 'towns' },      // TODO: we need to detect this from url?
			viewer: { type: Number, default: 0 },
			path: { type: Object, default: {} },
			route: { type: Object, default: {} },
		    blockedUsers: { type: Array, default: [] },
			context: { type: String, default: "item" }
		},
		data: function() {
			return {
				posts: this.data.posts || [],					// THIS is what we change when we load more... NOT the data prop.
				offset: 0,								// for backend query to api endpoint
				currLimit: this.limit,					// i think this is the amount we're displaying currently. starts as limit.
				postFilter: null,
				selectedTags: [],
				deletedPosts: [],
				count: this.data.count,
				isMember: this.data.isMember || false
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
				self.offset = self.$data.posts.length;
				self.$root.$emit('redrawVueMasonry');
				// if we've now displayed (almost) all we have, but there's more on backend, then get more
				if ((self.currLimit >= self.posts.length - self.limit) && (self.currLimit < self.count)) {
					self.getMoreData(self.circle, self.posts.length, self.backendLimit);
					return;
				}
				console.log('didnt need to get more data...');
			});

			this.$root.$on('postViewToggle', () => {
				this.$root.listView = ! this.$root.listView;
			});

			this.$root.$on('handlePostFilter', (type) => {
				if (type === this.$root.posts.filter) {
					this.$root.posts.filter = null;
				} else {
					this.$root.posts.filter = type;
				}
			});
		},
		watch: {
			items(newVal, oldVal) {
				if (this.currLimit > this.count) {
					window.$('#item-list-load-more').hide();
				} else {
					window.$('#item-list-load-more').show();
				}
			}
		},
		computed: {
			items() {
				let self = this;
				let results = [];

				console.info(this.posts.length);
				results = self.$lodash.filter(this.posts, function(item, index) {
					return !self.deletedPosts.includes(item.id);
				});

				if (self.$root.posts.filter) {
					results = self.$lodash.filter(results, function(item, index) {
						return item.type.name.toLowerCase() === self.$root.posts.filter;
					});
				}

				if (self.selectedTags.length > 0) {
					results = self.$lodash.filter(results, function(item, index) {
						return self.$findOne(self.$lodash.values(self.selectedTags), self.$lodash.values(self.$lodash.mapValues(item.tags, 'name')));
					});
				}

				if (self.$root.posts.selectedTown.length > 0) {
					results = self.$lodash.filter(results, function(item, index) {
						if (item.group && item.group.name.length > 0) {
							return item.group.name === self.$root.posts.selectedTown;
						} else {
							return false;
						}
					});
				}

				results = self.$lodash.filter(results, function(item, index) {
					return self.$lodash.inRange( index, 0, self.currLimit );
				});

				self.$root.$emit('redrawVueMasonry');
				console.log('items: ', results.length);
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
			},
			getTagsFromUrl: function(){
				let params = this.getUrlParams();
				return (params.tags) ? params.tags.split(",") : [];
			},
			getUrlParams() {
			    let vars = {};
			    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			        vars[key] = value;
			    });
			    return vars;
			},
			getMoreData: function(circle = this.circle, offset = this.posts.length, limit = this.backendLimit) {
				// TODO: ajaxy lazy-load more posts from backend - only when we run out.
				let self = this;
				console.info(offset);
				let results = axios.get(`/api/dash/${circle}/${offset}/${limit}`)
						.then(response => {

							if(response.status === 200) {
								//console.info('grabbed more posts: ', response.data.posts.length);
								response.data.posts.forEach((p, i) => {
									console.info(i);
									this.posts[offset + i] = p;    // push one new post at a time onto the old array of posts.
								}, self);
								self.offset = self.$root.posts.length;
								self.count = response.data.count;
								self.$emit('redrawVueMasonry');
								//return { count: response.data.count, posts: response.data.posts };
							} else {
								console.info('problem getting more posts from dash endpoint.');
								//return { count: self.count, posts: self.posts };  // TODO: or throw error?
							}
						});
			}
		},
		mounted() {
			let self = this;
			this.$root.posts.towns = this.data.towns;
			window.$('.tag-select').on('change', function() {
				self.selectedTags = window.$('.tag-select').val();
				self.$emit('redrawVueMasonry');
			});

			// check for tags in query param and set them on component and select field
			let tags = self.getTagsFromUrl();
			self.selectedTags = tags;
			window.$('.tag-select').val(tags);
		}
	}
</script>
