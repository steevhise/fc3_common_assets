<template>
	<div>
		<div class="horizontal_tabs">
			<ul class="tabs">
				<li v-for="category in topicCategories" class="tabs-title">
					<a :href="href(category)" @click="selectTopicCategory(category)" :aria-selected="category === currentTopicCategory">{{ category }}</a>
				</li>
			</ul>
		</div>
		<fc-messages-topics/>
	</div>
</template>

<script>
	import { mapGetters, mapActions, mapMutations } from 'vuex';

	export default {
		name: 'fc-messages-board-connected',
		props: {
			me: {
				type: Object
			}
		},
		created() {

			this.setViewingUser(this.me);
			this.loadTopics()
			.then(() => {
				const hash = window.location.hash;
				this.selectTopicCategory(hash ? this.categoryFromHash(hash) : this.topicCategories[0]);
			});
		},
		computed: mapGetters([
			'currentTopicCategory',
			'topicCategories'
		]),
		methods: {
			...mapActions([
				'loadTopics'
			]),
			...mapMutations([
				'selectTopicCategory',
				'setViewingUser'
			]),
			href(category) {

				return `#${this.normalizeCategory(category)}`
			},
			categoryFromHash(hash) {

				return hash.replace('#', '')
					.split('-')
					.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
					.join(' ');
			},
			normalizeCategory(category) {

				return category.toLowerCase().replace(/ /g, '-');
			}
		}
	}
</script>
