/**
 * This file contains the Vuex Store for the Internal Messaging System
 * @see src/assets/js/modules/fc3_components.js to register a new store.
 */

const jQuery = require('jquery');
const Moment = require('moment');

const state = {
	topics: {},
	threads: {},
	messages: {},
	currentTopicId: null,
	currentThreadId: null
};

const mutations = {
	loadTopics(state, topics) {

		state.topics = mergeDictionaries(state.topics, toTopicDictionary(topics));
	},
	loadTopic(state, { topic, threads, ...others }) {

		threads = threads.map((thread) => ({ ...thread, topic }));
		const topicId = toTopicId({ topic });

		state.threads = mergeDictionaries(state.threads, toDictionary(threads));
		state.topics[topicId] = {
			topic,
			threads: toIds(threads),
			...others
		};
	},
	selectTopic(state, { topic }) {

		const topicId = toTopicId({ topic });

		state.currentTopicId = topicId;
		state.currentThreadId = null;
	},
	deselectTopic(state) {

		state.currentTopicId = null;
		state.currentThreadId = null;
	},
	selectThread(state, { id, topic, messages, ...others }) {

		const topicId = toTopicId({ topic });

		if (topicId !== state.currentTopicId) {
			return console.warn(`Choosing thread ${id} for a topic ${topicId} other than the current ${state.currentTopicId}`);
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

		return jQuery.get('/api/messaging/topics')
		.then((topics) => {
			commit('loadTopics', topics);
		});
	},
	deselectTopic({ commit }) {
		commit('deselectTopic');
	},
	loadTopic({ commit }, { topic }) {

		const { type, id } = toStructuredTopicId(topic);

		return jQuery.get(`/api/messaging/topics/${type}` + (id ? `/${id}` : ''))
		.then((result) => {
			commit('loadTopic', result);
		});
	},
	selectTopic({ commit, dispatch, state }, { topic }) {

		return dispatch('loadTopic', { topic })
		.then(() => {

			commit('selectTopic', { topic });

			const { threads } = state.topics[toTopicId({ topic })];

			if (threads[0]) {
				return dispatch('selectThread', threads[0]);
			}
		});
	},
	selectThread({ commit, dispatch, state }, threadId) {

		const { topic } = state.threads[threadId];

		return jQuery.post(`/api/messaging/threads/${threadId}/read`)
		.then(() => {

			return Promise.all([
				dispatch('loadTopic', { topic }),
				jQuery.get(`/api/messaging/threads/${threadId}`).then((thread) => {
					commit('selectThread', thread);
				})
			]);
		});
	},
	sendMessage({ commit, dispatch, state }, body) {

		const { currentThreadId } = state;
		const { topic } = state.threads[currentThreadId];

		if (!currentThreadId) {
			return console.warn(`Message failed to send. Tried sending without a target thread selected`);
		}

		return jQuery.post('/api/messaging/send', { body, threadIdentifier: currentThreadId })
		.then(() => dispatch('selectThread', currentThreadId));
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
