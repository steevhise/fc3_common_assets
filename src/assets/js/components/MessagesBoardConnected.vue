<template>
	<div>
		<div class="horizontal_tabs">
			<ul class="tabs">
				<li v-for="category in categories" class="tabs-title">
					<a :href="href(category)" @click="selectTopicCategory(category)" :aria-selected="category === currentCategory">
						{{ category }}
						<span class="messages-unread-admin-badge" v-if="category === 'Admin Messages' && unreadAdminMessages">
							<span v-if="unreadAdminMessages <= 9">({{ unreadAdminMessages }})</span>
							<span v-if="unreadAdminMessages > 9">(9+)</span>
						</span>
					</a>
				</li>
			</ul>
		</div>
		<fc-messages-topics
			v-if="currentCategory !== 'Admin Messages'"
			:category="currentCategory"
			:topics="topicsInCategory"
			:on-click-topic="selectTopic"
			:topic-modal-id="modalId"
		/>
		<fc-messages
			v-if="currentCategory === 'Admin Messages'"
			show-html
			:messages="currentMessages.reverse()"
			:me="me"
		/>
		
		<fc-spinner v-if="topicsInCategory.length === 0" size="huge" message="Loading..." ></fc-spinner>
		
		<fc-modal :custom-target="modalId" :custom-trigger="`<div style='display: none;' data-open='${modalId}'></div>`">
			<fc-messages-board
				:class="{ open: currentTopic }"
				:topic="currentTopic"
				:messages="currentMessages"
				:threads="currentTopic && currentTopic.threads"
				:selected-thread="currentThread"
				:me="me"
				:on-click-thread="selectThread"
				:on-click-close="deselectTopic"
				:on-submit-message="sendMessage"
			/>
		</fc-modal>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';

	const TOPIC_CATEGORY_MAP = {
		'Posts': 'post',
		'To My Posts': 'post',
		'Chats With Friends': 'friend',
		'Group Moderators': 'group',
		'Admin Messages': 'system'
	};

	export default {
		name: 'fc-messages-board-connected',
		props: {
			me: {
				type: Object
			},
			modalId: {
				type: String,
				default: 'chatbox'
			}
		},
		data() {
			return {
				currentCategory: null,
				categories: Object.keys(TOPIC_CATEGORY_MAP)
			}
		},
		created() {

			const { hash, search } = window.location;
			const category = hash && this.categoryFromHash(hash);

			$(window).on('load', () => {

				// Foundation automatically registers a function to close modal on clicking the reveal modal
				// Since closing the modal corresponds to closing our topic, we need to register our handler for that user action
				const revealOverlay = $(`#${this.modalId}`).parent();
				revealOverlay.click((ev) => {
					// prevent closing when reveal's child elements e.g. the chat window are clicked
					if (ev.target !== ev.currentTarget) {
						return;
					}
					return this.deselectTopic();
				});

				// expects query param of thread={{ threadId }}
				const threadId = search && search.substring(1).match(/thread=(\d+)/)[1];
				if (threadId) {
					return this.selectNestedThread(threadId)
					.then(() => {

						const { topic } = this.currentTopic;
						return this.selectTopicCategory(this.categoryFromTopic(topic))
					});
				}
			});

			this.selectTopicCategory(category || this.categories[0]);
			this.loadTopics();
		},
		computed: {
			...mapGetters([
				'topics',
				'currentTopic',
				'currentThread',
				'currentMessages'
			]),
			topicsInCategory() {
				return this.getTopicsInCategory(this.currentCategory);
			},
			unreadAdminMessages() {
				return this.getTopicsInCategory('Admin Messages').reduce((count, topic) => {
					return count + topic.unreadCount;
				}, 0);
			}
		},
		watch: {
			topicsInCategory([currTopic], [prevTopic]) {

				const isSystem = (topic) => topic && topic.topic.type === 'system';

				// When transitioning to the system category, select the system topic automatically

				if (!isSystem(prevTopic) && isSystem(currTopic)) {
					this.selectTopic(currTopic);
				}

				if (isSystem(prevTopic) && !isSystem(currTopic)) {
					this.deselectTopic();
				}
			},
			currentTopic: function (newVal, oldVal) {

				// From unselected to selected (reloading the current topic e.g. in selectThread also triggers this watcher)
				if (newVal && !oldVal) {
					// Defers opening the modal till after onClickTopic wiring has resolved
					// Ensures modal opens with current thread (instead of opens w/ outdated, then rerenders)
					const modalTrigger = $(`[data-open='${this.modalId}']`);
					modalTrigger.click();
				}
			}
		},
		methods: {
			...mapActions([
				'loadTopics',
				'deselectTopic',
				'selectTopic',
				'selectThread',
				'selectNestedThread',
				'sendMessage'
			]),
			href(category) {

				return `#${this.normalizeCategory(category)}`
			},
			categoryFromHash(hash) {

				const category = hash.replace('#', '')
					.split('-')
					.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
					.join(' ');

				return (category in TOPIC_CATEGORY_MAP) ? category : null;
			},
			normalizeCategory(category) {

				return category.toLowerCase().replace(/ /g, '-');
			},
			selectTopicCategory(category) {

				if (category in TOPIC_CATEGORY_MAP) {
					this.currentCategory = category;
				}
			},
			getTopicsInCategory(category) {

				const type = TOPIC_CATEGORY_MAP[category];

				return this.topics.filter(({ topic }) => {

					if (topic.type !== type) {
						return false;
					}

					if (type === 'post') {
						if (category === 'To My Posts') {
							return this.me.id === topic.post.user.id;
						}
						else {
							return this.me.id !== topic.post.user.id;
						}
					}

					return true;
				});
			},
			categoryFromTopic(topic) {

				if (topic.type === 'post') {
					if (this.me.id === topic.post.user.id) {
						return 'To My Posts';
					}
					else {
						return 'Posts';
					}
				}

				const categories = Object.keys(TOPIC_CATEGORY_MAP);
				return categories[categories.map((c) => TOPIC_CATEGORY_MAP[c]).indexOf(topic.type)];
			}
		}
	}
</script>
