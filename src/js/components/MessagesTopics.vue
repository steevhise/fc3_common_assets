<template>
	<div>
		<div class="horizontal_tabs">
			<ul class="tabs">
				<li v-for="category in topicCategories" class="tabs-title">
					<a :href="href(category)" @click="selectTopicCategory(category)" :aria-selected="category === currentTopicCategory">{{ category }}</a>
				</li>
			</ul>
		</div>
		<div class="row column message-reply-list-container">
		    <h3>{{ currentTopicCategory }}</h3>
		    <ul class="message-reply-list">
				<div v-for="topic in currentTopics" :key="topic.id">
			        <li class="message-reply-list-item" @click="selectTopic($event)">
						<div class="message-list-item-left">
						    <div class="message-title">
						    	<img v-if="topic.image" class="message-image" :src="topic.image"/>
						      	<h4>{{topic.title}}</h4>
						    </div>
							<div v-if="topic.type" class="message-type"> <!-- only posts have type prop -->
								<!-- TODO Find an actual strategy for dealing w/ svgs -->
						     	<div class="post-list-item-category-icon">
								 	<div v-if="topic.type.name === 'OFFER'">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-offer">
  									    	<path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
  									    	<path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
  										</svg>
  							        	<span v-if="topic.type.name === 'OFFER'" class="text-offer">Offer</span>
								  	</div>
									<div v-if="topic.type.name === 'LEND'">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-lend">
										    <path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
										    <path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
										</svg>
								        <span  class="text-lend">Lend</span>
									</div>
									<div v-if="topic.type.name === 'BORROW'">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-borrow">
										    <path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
										    <path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
										</svg>
								        <span class="text-borrow">Borrow</span>
									</div>
									<div v-if="topic.type.name === 'WANTED'">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-wanted">
										    <path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
										    <path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
										</svg>
								        <span class="text-wanted">Wanted</span>
									</div>
						      </div>
						    </div>
							<div class="message-time">
						      <span class="text-lighten">{{ topic.updatedAt }}</span>
						    </div>
							<div class="message-list-item-right">
						      <div v-if="topic.unreadCount > 0" class="message-notification">
						        <span>{{ topic.unreadCount }} Unread Replies</span>
						      </div>
						      <div class="message-arrow">
								<svg xmlns="http://www.w3.org/2000/svg" width="7.69" height="11.4" viewBox="0 0 7.69 11.4" class="icon-message-arrow">
								    <path d="M1274.55,1403.45c-0.55-.56-1.05-0.15-1.6.41s-0.96,1.06-.41,1.62l3.42,3.45-3.32,3.35c-0.55.56-.15,1.06,0.41,1.62s1.05,0.97,1.6.4l5.33-5.37Z" transform="translate(-1272.28 -1403.19)"/>
								</svg>
						      </div>
						    </div>
						</div>
					</li>
					<fc-messages-board></fc-messages-board>
				</div>
		    </ul>
		</div>
	</div>
</template>

<script>

	import moment from 'moment';

	const TOPIC_CATEGORY_MAP = {
		'Posts': 'post',
		'My Posts': 'post',
		'Chats With Friends': 'friend',
		'Group Moderators': 'group',
		'Admin Messages': 'system'
	};

	// Sorry, got really really lazy :)
	// TODO Remove
	const stubTopics = JSON.parse(JSON.stringify([{"topic":{"type":"friend","user":{"id":1,"username":"deronbeal"}},"unreadCount":0,"updatedAt":"1970-01-01T00:00:00.000Z"},{"topic":{"type":"system"},"unreadCount":0,"updatedAt":"1970-01-01T00:00:00.000Z"},{"topic":{"type":"post","post":{"id":65229301,"user":{"id":23736881,"username":"steevhise"},"subject":"Tool that's not tagged Tools","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":null,"thumb":null}},"unreadCount":0,"updatedAt":"2018-06-12T21:43:55.000Z"},{"topic":{"type":"group","group":{"id":1014,"name":"Tucson","region":{"id":5,"name":"Arizona"},"latitude":31.5,"longitude":-111}},"unreadCount":0,"updatedAt":"2018-06-08T20:46:29.000Z"},{"topic":{"type":"friend","user":{"id":23736881,"username":"steevhise"}},"unreadCount":0,"updatedAt":"2018-06-12T21:20:59.000Z"},{"topic":{"type":"post","post":{"id":65229288,"user":{"id":26619878,"username":"fc3devtest"},"subject":"a bunch of batteries","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":"https://images.freecycle.org/posts/images/5194380","thumb":"https://images.freecycle.org/posts/images/5194380/thumb"}},"unreadCount":12,"updatedAt":"2018-06-15T17:11:00.000Z"},{"topic":{"type":"post","post":{"id":65229294,"user":{"id":23736881,"username":"steevhise"},"subject":"A Really Long Long Title to see what the layout looks like in that case.","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":"https://images.freecycle.org/posts/images/5194382","thumb":"https://images.freecycle.org/posts/images/5194382/thumb"}},"unreadCount":0,"updatedAt":"2018-06-15T17:11:00.000Z"},{"topic":{"type":"post","post":{"id":65229286,"user":{"id":1,"username":"deronbeal"},"subject":"[test] A test post Fri May 25 2018 15:44:59 GMT-0700 (MST)","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":null,"thumb":null}},"unreadCount":2,"updatedAt":"2018-06-19T15:53:59.000Z"},{"topic":{"type":"post","post":{"id":65229302,"user":{"id":1,"username":"deronbeal"},"subject":"[test] A test post Tue Jun 12 2018 15:05:55 GMT-0700 (MST)","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":null,"thumb":null}},"unreadCount":2,"updatedAt":"2018-06-20T18:22:37.000Z"}]));

	export default {
		name: 'fc-messages-topics',
		props: {
			me: {
				type: Object,
				default: () => ({
					id: 1,
					username: 'deronbeal'
				})
			},
			topicCategories: {
				type: Array,
				default: () => (Object.keys(TOPIC_CATEGORY_MAP))
			},
			topics: { // TODO Remove, should be data, I imagine?
				type: Array,
				default: () => (stubTopics)
			}
		},
		data() {
			return {
				currentTopicCategory: ''
			}
		},
		created() {

			this.currentTopicCategory = this.topicCategories[0];
		},
		computed: {
			currentTopics() {

				let topics = [];
				const type = TOPIC_CATEGORY_MAP[this.currentTopicCategory];
				topics = this.topics.filter(({ topic }) => topic.type === type);

				if (type === 'post') {
					if (this.currentTopicCategory === 'Posts') {
						topics = topics.filter(({ topic: { post: { user }} }) => this.me.id !== user.id);
					}

					if (this.currentTopicCategory === 'My Posts') {
						topics = topics.filter(({ topic: { post: { user }} }) => this.me.id === user.id);
					}
				}

				const typeDisplays = {
					post: ({ image, subject, type }) => ({ image, title: subject, type }),
					// TODO Safe to hardcode image server????
					friend: ({ username, id }) => ({ image: `https://images.freecycle.org/user/${id}`, title: username }),
					group: ({ name }) => ({ title: name }),
					system: () => ({ title: 'SYSTEM'}) // TODO Delete; garbage
				}

				// TODO consider using babel plugin for object rest/spread here???
				return topics.map(({ topic, updatedAt, unreadCount }, index) => {

					const display = typeDisplays[type](topic[type === 'friend' ? 'user' : type] || {});
					return {
						// sets a namespaced pseudo-id to prevent Vue from reusing the DOM for the topic list items,
						// which would persist open state of topics by order in DOM across different topic categories
						id: `${this.normalizeCategory(this.currentTopicCategory)}-${index}`,
						updatedAt: moment(updatedAt).fromNow(),
						unreadCount,
						title: display.title,
						image: display.image,
						type: display.type
					}
				});
			}
		},
		methods: {
			selectTopicCategory(category) {

				this.currentTopicCategory = category;
			},
			selectTopic(event) {

				const topicEl = $(event.currentTarget);
				// class of the root element of the fc-messages-board component
				const topicMessageBoard = topicEl.siblings('.message-list-item-details');

				topicEl.toggleClass('open');
				topicMessageBoard.toggleClass('open');
			},
			normalizeCategory(category) {

				return category.toLowerCase().replace(/ /g, '-');
			},
			href(category) {

				return `#${this.normalizeCategory(category)}`
			}
		}
	}


</script>
