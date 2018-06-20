<template>
	<div>
		<div class="topic-tabs">
			<ul>
				<li v-for="category in topicCategories" :key="category">
					<!-- :href="href(category)" TODO Format links -->
					<a  @click="selectTopicCategory(category)" :class="{ 'is-active': category === currentTopicCategory }">{{ category }}</a>
				</li>
			</ul>
		</div>
		<div class="row column message-reply-list-container">
		    <h3>{{ currentTopicCategory }}</h3>
		    <ul class="message-reply-list">
				<div v-for="topic in currentTopics" :key="topic.id">
			        <li class="message-reply-list-item"> <!-- TODO Remove key; just did to shutup vue linting thing; not necessary -->
						<div class="message-list-item-left">
						    <div class="message-title">
						      <img v-if="topic.image" class="message-image" :src="topic.image"/>
						      <h4>{{topic.title}}</h4>
						    </div>
							<div v-if="topic.type" class="message-type"> <!-- only posts have type prop -->
						      <div class="post-list-item-category-icon">
						        <!-- {% include '../icons/chevron.html' with {className:'icon-chevron-offer'} only %} -->
						        <span v-if="topic.type.name === 'OFFER'" class="text-offer">Offer</span>
						        <!-- {% include '../icons/chevron.html' with {className:'icon-chevron-lend'} only %} -->
						        <span v-if="topic.type.name === 'LEND'" class="text-lend">Lend</span>
						        <!-- {% include '../icons/chevron.html' with {className:'icon-chevron-borrow'} only %} -->
						        <span v-if="topic.type.name === 'BORROW'" class="text-borrow">Borrow</span>
						        <!-- {% include '../icons/chevron.html' with {className:'icon-chevron-wanted'} only %} -->
						        <span v-if="topic.type.name === 'BORROW'" class="text-wanted">Wanted</span>
						      </div>
						    </div>
							<div class="message-time">
						      <span class="text-lighten">{{ topic.updatedAt }}</span>
						    </div>
							<div class="message-list-item-right">
						      <div class="message-notification">
						        <span>{{ topic.unreadCount }}</span>
						      </div>
						      <div class="message-arrow">
								<!-- Find an actual strategy for dealing w/ svgs -->
								<svg xmlns="http://www.w3.org/2000/svg" width="7.69" height="11.4" viewBox="0 0 7.69 11.4" class="icon-message-arrow">
								    <path d="M1274.55,1403.45c-0.55-.56-1.05-0.15-1.6.41s-0.96,1.06-.41,1.62l3.42,3.45-3.32,3.35c-0.55.56-.15,1.06,0.41,1.62s1.05,0.97,1.6.4l5.33-5.37Z" transform="translate(-1272.28 -1403.19)"/>
								</svg>
						      </div>
						    </div>
						</div>
					</li>
					<fc-message-board></fc-message-board>
				</div>
		    </ul>
		</div>
	</div>
</template>

<script>

	const topicMap = {
		'Posts': 'post',
		'My Posts': 'post',
		'Chats with Friends': 'friend',
		'Group Moderators': 'group',
		'Admin Messages': 'system'
	};

	// Sorry, got really really lazy :)
	const stubTopics = JSON.parse(JSON.stringify([{"topic":{"type":"friend","user":{"id":1,"username":"deronbeal"}},"unreadCount":0,"updatedAt":"1970-01-01T00:00:00.000Z"},{"topic":{"type":"system"},"unreadCount":0,"updatedAt":"1970-01-01T00:00:00.000Z"},{"topic":{"type":"post","post":{"id":65229301,"user":{"id":23736881,"username":"steevhise"},"subject":"Tool that's not tagged Tools","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":null,"thumb":null}},"unreadCount":0,"updatedAt":"2018-06-12T21:43:55.000Z"},{"topic":{"type":"group","group":{"id":1014,"name":"Tucson","region":{"id":5,"name":"Arizona"},"latitude":31.5,"longitude":-111}},"unreadCount":0,"updatedAt":"2018-06-08T20:46:29.000Z"},{"topic":{"type":"friend","user":{"id":23736881,"username":"steevhise"}},"unreadCount":0,"updatedAt":"2018-06-12T21:20:59.000Z"},{"topic":{"type":"post","post":{"id":65229288,"user":{"id":26619878,"username":"fc3devtest"},"subject":"a bunch of batteries","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":"https://images.freecycle.org/posts/images/5194380","thumb":"https://images.freecycle.org/posts/images/5194380/thumb"}},"unreadCount":12,"updatedAt":"2018-06-15T17:11:00.000Z"},{"topic":{"type":"post","post":{"id":65229294,"user":{"id":23736881,"username":"steevhise"},"subject":"A Really Long Long Title to see what the layout looks like in that case.","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":"https://images.freecycle.org/posts/images/5194382","thumb":"https://images.freecycle.org/posts/images/5194382/thumb"}},"unreadCount":0,"updatedAt":"2018-06-15T17:11:00.000Z"},{"topic":{"type":"post","post":{"id":65229286,"user":{"id":1,"username":"deronbeal"},"subject":"[test] A test post Fri May 25 2018 15:44:59 GMT-0700 (MST)","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":null,"thumb":null}},"unreadCount":2,"updatedAt":"2018-06-19T15:53:59.000Z"},{"topic":{"type":"post","post":{"id":65229302,"user":{"id":1,"username":"deronbeal"},"subject":"[test] A test post Tue Jun 12 2018 15:05:55 GMT-0700 (MST)","type":{"typeId":1,"const":"FC_POST_OFFER","name":"OFFER"},"image":null,"thumb":null}},"unreadCount":2,"updatedAt":"2018-06-20T18:22:37.000Z"}]));

	// import methods from 'vuex' TODO Add later when wired up
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
				default: () => (Object.keys(topicMap))
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
		mounted() {

			this.currentTopicCategory = this.topicCategories[0];
			//this.selectTopicCategory(currentTopicCategory);
		},
		computed: {
			currentTopics() {

				let topics = [];
				const type = topicMap[this.currentTopicCategory];
				topics = this.topics.filter(({ topic }) => topic.type === type);

				if (type === 'post') {
					if (this.currentTopicCategory === 'Posts') {
						topics = topics.filter(({ topic: { post: { user }} }) => this.me.id !== user.id);
					}

					if (this.currentTopicCategory === 'My Posts') {
						topics = topics.filter(({ topic: { post: { user }} }) => this.me.id === user.id);
					}
				}

				return this.displayify(type, topics);;
			}
		},
		methods: {
			selectTopicCategory(category) {

				// show that tab is selected
				// display set of topics corresponding to topic selected

				// How should this work, VueX-y? What should happen w/ click events?
			},
			displayify(type, topics) {

				const typeMapper = {
					// TODO Failing here b/c image is undefined????
					post: (post) => ({ image, subject: title, type }),
					// TODO Safe to hardcode image server????
					friend: (user) => ({ image: `https://images.freecycle.org/user/${user.id}`, username: title }),
					group: (group) => ({ name: title }),
					system: () => ({ title: 'SYSTEM'}) // TODO Delete; garbage
				}

				// TODO consider using babel plugin for object spread here: babel-plugin-transform-object-rest-spread
				return topics.map(({ topic, updatedAt, unreadCount }) => {

					const display = typeMapper[type](topic[type]);
					return {
						updatedAt,
						unreadCount,
						title: display.title,
						image: display.image,
						type: display.type
					}
				});
				/**
				const shape = {
					unreadCount,
					updatedAt, // TODO momentify this
					image,
					title,
					postType
				}
				**/
			}
		}
	}


</script>
