<template>
	<div>
		<div class="row column message-reply-list-container">
		    <h3>{{ currentTopicCategory }}</h3>
		    <ul class="message-reply-list">
				<div v-for="topic in currentTopics" :key="topic.id"> <!-- key is namespaced key id created in toTopicId -->
			        <li class="message-reply-list-item" @click="openTopic($event, topic)">
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
					<fc-messages-board />
				</div>
		    </ul>
		</div>
	</div>
</template>

<script>

	import { mapGetters, mapActions } from 'vuex';

	export default {
		name: 'fc-messages-topics',
		data() {
			return {}
		},
		computed: mapGetters([
			'currentTopic',
			'currentTopics',
			'currentThread',
			'currentMessages',
		]),
		methods: {
			...mapActions([
				'selectTopic',
				'selectThread'
			]),
			openTopic(event, topic) {

				return this.selectTopic(topic.data) // data is prop on shape produced by currentTopics getter
				.then(() => {

					const topicEl = $(event.currentTarget);
					// class of the root element of the fc-messages-board component
					const topicMessageBoard = topicEl.siblings('.message-list-item-details');

					// TODO Switch this shit out with Ryan's work -->
					topicEl.toggleClass('open');
					topicMessageBoard.toggleClass('open');
				});
			}
		}
	}


</script>
