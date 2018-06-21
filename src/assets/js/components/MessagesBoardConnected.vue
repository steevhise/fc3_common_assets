<template>
	<div>
		<ul>
			<li v-for="topic in topics" @click="selectTopic(topic.topic)">
				{{topic}}
			</li>
		</ul>
		<fc-messages-board
			v-bind:threads="currentTopic.threads"
			v-bind:messages="currentMessages"
			v-bind:you="currentThread.user"
			v-bind:me="{ id: 42, username: 'devinivy' }"
			v-bind:select-thread="selectThread"
		/>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'

	export default {
		name: 'fc-messages-board-connected',
		created() {
			this.loadTopics();
		},
		computed: mapGetters([
			'topics',
			'currentTopic',
			'currentThread',
			'currentMessages'
		]),
		methods: mapActions([
			'loadTopics',
			'selectTopic',
			'selectThread'
		])
	}
</script>
