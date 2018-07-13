<template>
	<div>
		<div class="row column message-reply-list-container">
		    <h3>{{ category }}</h3>
		    <ul v-if="topics && topics.length" class="message-reply-list">
				<div v-for="topic in topics" :key="topic.id"> <!-- key is namespaced key id created in toTopicId -->
			        <li class="message-reply-list-item" @click="onClickTopic(topic)">
						<div class="message-list-item-left">
						    <div class="message-title">
						    	<img v-if="image(topic)" class="message-image" :src="image(topic)"/>
						      	<h4>{{title(topic)}}</h4>
						    </div>
							<div v-if="topic.topic.type === 'post'" class="message-type">
						     	<fc-post-icon :post="topic.topic.post" />
						  </div>
							<div class="message-time">
						      <span class="text-lighten">{{ ago(topic.updatedAt) }}</span>
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
				</div>
		    </ul>
			<div v-else><p style="text-align: center;">No conversations in this category</p></div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	import helpers from './helpers';

	export default {
		name: 'fc-messages-topics',
		props: {
			category: String,
			topics: Array,
			onClickTopic: Function,
			topicModalId: String
		},
		data() {
			return {}
		},
		methods: {
			ago: (time) => moment(time).fromNow(),
			title: helpers.topicTitle,
			image: ({ topic }) => {

				const byType = {
					post: ({ post }) => post.image,
					friend: ({ user }) => `https://images.freecycle.org/user/${user.id}`,
					default: () => null
				};

				const makeImage = byType[topic.type] || byType.default;

				return makeImage(topic);
			}
		}
	}


</script>
