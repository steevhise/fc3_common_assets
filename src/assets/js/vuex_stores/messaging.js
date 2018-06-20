/**
 * This file contains the Vuex Store for the Internal Messaging System
 * @see src/assets/js/modules/fc3_components.js to register a new store.
 */

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
	selectTopic(state, { topic, threads, ...others }) {

		const topicId = toTopicId(topic);

		state.currentTopicId = topicId;
		state.currentThreadId = null;
		state.messages = null;
		state.threads = toDictionary(threads);
		state.topics[topicId] = {
			topic,
			threads: toIds(threads),
			...others
		};
	},
	selectThread(state, { id, topic, messages, ...others }) {

		const topicId = toTopicId(topic);

		if (topicId !== state.currentTopicId) {
			console.warn(`Choosing thread ${id} for a topic ${topicId} other than the current ${state.currentTopicId}`);
		}

		state.currentThreadId = id;
		state.messages = toDictionary(messages);
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

	}
	selectTopic({ commit }) {

	},
	selectThread({ commit }) {

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
const toTopicId = ({ type, post, user, group }) => {

	const { id } = post || user || group || {};

	return type + (id ? '' : `-${id}`);
};

const toIds = (items) => items.map(toId);
const toDictionary = makeToDictionary(toId);
const toTopicDictionary = makeToDictionary(toTopicId);
