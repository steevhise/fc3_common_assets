<template>
    <div id="fc-data">
        <fc-lend-message ref="lendMessage"/>

        <component :is="component" v-for="(item, index) in items" :key="item.id" :path="path"
                   :blocked-users=blockedUsers :item="item" :index="index" :viewer="viewer" :isMember="isMember"
                   :route="route" v-bind:limit="Number(limit)"
                   v-on:post-deleted.passive="removeItem(index)"
                   v-on:post-marked.passive="updatePostType"
                   v-on:post-returned.passive="postReturned"
        >
        </component>
        <fc-lend-friends-select v-on:friend-selected.passive="postLent"/>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'fc-data',
        props: {
            limit: { type: Number, default: 25 },			// this is how many we load onto visible page at a time.
            backendLimit: { type: Number, default: 50 },     // this is how many we get from api endpoint
            component: { type: String, required: true },
            data: { type: Object, default: {} },				// this doesn't change... no props should change
            circle: { type: String, default: '' },      		//  pass it in from html
            viewer: { type: Number, default: 0 },
            path: { type: Object, default: {} },
            route: { type: Object, default: {} },
            blockedUsers: { type: Array, default: [] },
            context: { type: String, default: "item" }
        },
        data: function () {
            return {
                posts: this.data.posts || [],					// THIS is what we change when we load more... NOT the data prop.
                offset: 0,								// for backend query to api endpoint - this should increment by backendLimit
                currLimit: this.limit,					// this is the amount we're displaying currently. starts as limit.
                postFilter: null,
                selectedTags: [],
                deletedPosts: [],
                count: this.data.count || this.data.posts.length,
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
                // console.log('loadMorePosts start', self.currLimit, self.limit, self.offset, self.posts.length, self.$data.posts.length, self.count)
                self.currLimit += Number(self.limit);
                self.offset = self.$data.posts.length;
                // if we've now displayed (almost) all we have, but there's more on backend, then get more from endpoint
                // but (for now at least) only on dashboard
                if (self.currLimit >= self.posts.length - self.limit) {
                    if (!!self.circle) {
                        // (50 >= 20 - 10) && (50 < 265) && !self.circle
                        // TODO: create and use a self.getMorePosts() method instead of self.getMoreData()
                        // TODO: This never runs on posts search because "!!self.circle" is always false
                        console.log('call getMoreData()')
                        let town = 0
                        if (self.$root.posts.selectedTown.length) {
                            const match = self.$root.posts.towns.find(town => town.name === self.$root.posts.selectedTown)
                          if (match !== undefined) town = parseInt(match.id)
                        }
                        self.getMoreData(self.circle, self.posts.length, self.backendLimit, town);
                        return;
                    } else {
                        self.getMorePostsFromElasticsearch(self.posts.length, self.backendLimit);
                        return;
                    }
                } else {
                    console.log('did not get more because self.currLimit < self.items.length - self.limit')
                }
                self.$root.$emit('redrawVueMasonry');
            });

            this.$root.$on('postViewToggle', () => {
                this.$root.listView = !this.$root.listView;
            });

            this.$root.$on('handlePostFilter', (type) => {
                if (type === this.$root.posts.filter) {
                    this.$root.posts.filter = null;
                } else {
                    this.$root.posts.filter = type;
                }
            });

            this.$root.$on('handleLayoutChange', () => {
                const itemInterval = setInterval(() => {
                    const postListLinks = document.querySelectorAll('.post-list-item-content-description h4 a')
                    const postGridLinks = document.querySelectorAll('.post-grid-item-content h4 a')
                    if ((this.$root.posts.layout === 'list' && postListLinks.length >= this.items.length) ||
                        (this.$root.posts.layout === 'grid' && postGridLinks.length >= this.items.length)) {
                        clearInterval(itemInterval)
                        document.dispatchEvent((new Event('posts-loaded')));
                    }
                }, 100);
            });
        },
        watch: {
            items(newVal, oldVal) {
                if (newVal.length) this.$root.$emit('handleLayoutChange')
                if (this.currLimit > this.count) {
                    window.$('#item-list-load-more').hide();
                } else {
                    if (newVal.length === 0) this.$root.$emit('loadMorePosts')
                    window.$('#item-list-load-more').show();
                }
            }
        },
        computed: {
            items() {
                let self = this;
                let results = [];

                results = self.$lodash.filter(this.posts, function (item, index) {
                    return !self.deletedPosts.includes(item.id);
                });

                if (self.$root.posts.filter) {
                    results = self.$lodash.filter(results, function (item, index) {
                        return item.type.name.toLowerCase() === self.$root.posts.filter;
                    });
                }

                if (self.selectedTags.length > 0) {
                    results = self.$lodash.filter(results, function (item, index) {
                        return self.$findOne(self.$lodash.values(self.selectedTags), self.$lodash.values(self.$lodash.mapValues(item.tags, 'name')));
                    });
                }

                if (self.$root.posts.selectedTown.length > 0) {
                    results = self.$lodash.filter(results, function (item, index) {
                        if (item.group && item.group.name.length > 0) {
                            return item.group.name === self.$root.posts.selectedTown;
                        } else {
                            return self.$root.posts.selectedTown === 'Friends Circle';
                        }
                    });
                }

                results = self.$lodash.filter(results, function (item, index) {
                    return self.$lodash.inRange(index, 0, self.currLimit);
                });

                self.$root.$emit('redrawVueMasonry');

                //console.debug('items: ', results);
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
                this.$bus.$emit('alert', { level: 'success', message: `<p>${t('Post')} <strong>${post.subject}</strong> ${t('marked as') } ${type.name}</p>`, timer: 8000 });
            },
            postLent: function ({ share, post, threadId }) {

                const { $lodash, posts } = this;
                const matchId = (p) => p.id === post.id;

                // $set / $delete (see postReturned below) must be used for setting / deleting the share property
                // b/c Vue's reactivity system doesn't watch these types of mutations i.e. regular mutation doesn't trigger
                // component rerender
                this.$set(post, 'share', share);
                posts[$lodash.findIndex(posts, matchId)] = post;
                this.$bus.$emit('alert', { level: 'success', message: `${this.t('You lent')} <strong>${post.subject}</strong>!`, timer: 20000 });

                this.$refs.lendMessage.post = post;
                this.$refs.lendMessage.lendThreadId = threadId;
                console.debug('about to open lendMessage form...');
                $('#lendMessageTrigger').click(); // open optional lend message form (fc-lend-message)
            },
            postReturned: function ({ post }) {

                const { $lodash, posts } = this;
                const matchId = (p) => p.id === post.id;

                this.$delete(post, 'share');
                posts[$lodash.findIndex(posts, matchId)] = post;
                this.$bus.$emit('alert', { level: 'success', message: `<strong>${post.subject}</strong> ${this.t('has been returned!')}`, timer: 20000 });
            },
            getTagsFromUrl: function () {
                let params = this.getUrlParams();
                return (params.tags) ? params.tags.split(",") : [];
            },
            getUrlParams() {
                let vars = {};
                let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                    vars[key] = value;
                });
                return vars;
            },
            getMoreData: function (circle = this.circle, offset = this.posts.length, limit = this.backendLimit, town = 0) {
                // ajaxy lazy-load more posts from backend
                let self = this;
                let results = axios.get(`/api/dash/${circle}/${offset}/${limit}`, { params: { town } })
                    .then(response => {

                        if (response.status === 200) {
                            response.data.posts.forEach((p, i) => {
                                this.posts[offset + i] = p;    // push one new post at a time onto the old array of posts. TODO: try push again instead?
                            }, self);
                            let ids = self.posts.map(o => o.id);
                            self.posts = self.posts.filter(({id}, index) => !ids.includes(id, index+1));
                            self.offset = self.$root.posts.length;
                            self.count = response.data.count || self.count;
                            //self.$emit('redrawVueMasonry');
                        } else {
                            console.error('problem getting more posts from dash endpoint:', response.status);
                        }
                    });
            },
            getMorePostsFromElasticsearch: function (offset, limit) {
                // ajaxy lazy-load more posts from backend
                let self = this;
                const requestData = {
                    searchText: self.data.criteria.search,
                    town: (self.data.criteria.town === 'ALL_TOWNS') ? 'all' : self.data.criteria.town,
                    size: limit,
                    from: offset,
                    responseType: 'json'
                }
                // TODO: convert the filter from text to integer-constant for post types
                if (this.$root.posts.filter) requestData.postType = this.$root.posts.filter
                let results = axios.post(`/search-posts`, requestData)
                    .then(response => {
                        if (response.status === 200) {
                            response.data.data.posts.forEach((p, i) => {
                                this.posts.push(p); // push one new post at a time onto the old array of posts.
                            }, this);
                            self.offset = self.$root.posts.length;
                            self.count = response.data.data.count || self.count;
                        } else {
                            console.error('problem getting more posts from dash endpoint:', response.status);
                        }
                    });
            }
        },
        mounted() {
            let self = this;
            this.$root.posts.towns = this.data.towns;
            window.$('.tag-select').on('change', function () {
                self.selectedTags = window.$('.tag-select').val();
                self.$emit('redrawVueMasonry');
            });

            // check for tags in query param and set them on component and select field
            let tags = self.getTagsFromUrl();
            self.selectedTags = tags;
            window.$('.tag-select').val(tags);

            // pre-emptively load more posts from backend pretty soon after page render.
            if (!!self.circle) {   // if it's the dashboard...
                setTimeout(() => {
                    self.getMoreData(self.circle, self.posts.length, self.backendLimit);
                }, 2000)
            }

        }
    }
</script>
