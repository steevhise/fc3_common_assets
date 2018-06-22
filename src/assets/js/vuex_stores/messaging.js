/**
 * This file contains the Vuex Store for the Internal Messaging System
 * @see src/assets/js/modules/fc3_components.js to register a new store.
 */

const jQuery = require('jquery');
const Moment = require('moment');

const state = {
	me: {},
	topics: {},
	threads: {},
	messages: {},
	currentTopicId: null,
	currentThreadId: null,
	currentTopicCategory: null
};

const mutations = {
	setViewingUser(state, { ...user } = { id, username }) {

		state.me = user;
	},
	loadTopics(state, topics) {

		state.topics = mergeDictionaries(state.topics, toTopicDictionary(topics));
	},
	selectTopicCategory(state, category) {

		state.currentTopicCategory = category;
	},
	selectTopic(state, { topic, threads, ...others }) {

		const topicId = toTopicId({ topic });

		state.currentTopicId = topicId;
		state.currentThreadId = null;
		state.threads = mergeDictionaries(state.threads, toDictionary(threads));
		// TODO Why this???? ASK!!!!! To make sure data of current topic is up-to-date?
		state.topics[topicId] = {
			topic,
			threads: toIds(threads),
			...others
		};
	},
	selectThread(state, { id, topic, messages, ...others }) {

		const topicId = toTopicId({ topic });

		if (topicId !== state.currentTopicId) {
			console.warn(`Choosing thread ${id} for a topic ${topicId} other than the current ${state.currentTopicId}`);
		}

		state.currentThreadId = id;
		state.messages = mergeDictionaries(state.messages, toDictionary(messages));
		state.threads[id] = {
			id,
			topic,
			messages: toIds(messages),
			...others
		};
	}
};

const actions = {
	loadTopics({ commit }) {

		jQuery.get('/api/messaging/topics', (topics) => {
			commit('loadTopics', topics);
		});
	},
	selectTopic({ commit, dispatch, state }, { topic }) {

		const { type, id } = toStructuredTopicId(topic);

		jQuery.get(`/api/messaging/topics/${type}` + (id ? `/${id}` : ''), (topic) => {

			commit('selectTopic', topic);

			const thread = topic.threads[0];

			if (thread) {
				dispatch('selectThread', thread.id);
			}
		});
	},
	selectThread({ commit }, threadId) {
		jQuery.get(`/api/messaging/threads/${threadId}`, (thread) => {

			commit('selectThread', thread);
		});
	}
};

const getters = {
	currentMessages({ messages }, getters) {

		const { currentThread } = getters;
		const messageIds = (currentThread && currentThread.messages) || [];

		return messageIds.map((id) => messages[id]);
	},
	currentThread({ threads, currentThreadId }) {
		return threads[currentThreadId] || null;
	},
	currentTopic({ topics, threads, currentTopicId }) {

		const topic = topics[currentTopicId];

		if (!topic) {
			return null;
		}

		return {
			...topic,
			threads: (topic.threads || []).map((id) => threads[id])
		};
	},
	topics({ topics }) {
		return Object.values(topics);
	},
	totalUnreads({ topics, threads }) {
		return Object.values(topics).reduce((count, t) => count + t.unreadCount, 0);
	},
	topicCategories() {
		return Object.keys(TOPIC_CATEGORY_MAP);
	},
	currentTopicCategory({ currentTopicCategory }) {
		return currentTopicCategory;
	},
	currentTopics({ currentTopicCategory, topics, me }) {

		let currentCategoryTopics = [];
		const type = TOPIC_CATEGORY_MAP[currentTopicCategory];
		const typeDisplays = {
			post: ({ image, subject, type }) => ({ image, title: subject, type }),
			// TODO Safe to hardcode image server????
			friend: ({ username, id }) => ({ image: `https://images.freecycle.org/user/${id}`, title: username }),
			group: ({ name }) => ({ title: name }),
			system: () => ({ title: 'SYSTEM'}) // TODO Delete; garbage
		}

		// we iterate over our dictionary, not the topics array (via our getter)
		// so we can hold on to our topicId in the final shape passed to our template,
		// which we need for our v-for key value so Vue doesn't mistakenly reuse
		// our topic list components across categories
		for (const topicId in topics) {

			const { topic, updatedAt, unreadCount } = topics[topicId];

			if (topic.type !== type) {
				continue;
			}

			if (type === 'post') {

				let { post: { user } } = topic;

				if (currentTopicCategory === 'Posts' && me.id === user.id) {
					continue;
				}
				if (currentTopicCategory === 'My Posts' && me.id !== user.id) {
					continue;
				}
			}

			currentCategoryTopics.push({
				id: topicId,
				...typeDisplays[type](topic[type === 'friend' ? 'user' : type] || {}),
				updatedAt: Moment(updatedAt).fromNow(),
				unreadCount,
				data: { topic }
			});
		}

		return currentCategoryTopics;
	},
	me({ me }) {
		return me;
	}
};

export const MessagingStore = {
	state,
	mutations,
	actions,
	getters
};

const mergeDictionaries = (prevDict, currDict) => {

	return Object.keys(currDict).reduce((collect, key) => {

		const prevVal = prevDict[key] || {};
		const currVal = currDict[key];

		return {
			...collect,
			[key]: { ...prevVal, ...currVal }
		};
	}, {});
};

const makeToDictionary = (getId) => (items) => {
	return items.reduce((collect, item) => {
		return {
			...collect,
			[getId(item)]: item
		};
	}, {});
};

const toId = (item) => item.id;

const toStructuredTopicId = ({ type, post, user, group }) => {

	const { id } = post || user || group || {};

	return { type, id };
};

const toTopicId = ({ topic }) => {

	const { type, id } = toStructuredTopicId(topic);

	return type + (id ? `-${id}` : '');
};

const toIds = (items) => items.map(toId);
const toDictionary = makeToDictionary(toId);
const toTopicDictionary = makeToDictionary(toTopicId);

const TOPIC_CATEGORY_MAP = {
	'Posts': 'post',
	'My Posts': 'post',
	'Chats With Friends': 'friend',
	'Group Moderators': 'group',
	'Admin Messages': 'system'
};
