<template>
	<fc-messages-notifier v-bind:unread-replies-count="onMyReplies ? totalUnreads : staticUnreads" />
</template>

<script>

	import { mapGetters } from 'vuex';

	export default {
		name: 'fc-messages-notifier-connected',
		props: {
			staticUnreads: Number,
			onMyReplies: Boolean
		},
		data() {
			return {}
		},
		computed: {
			...mapGetters([
				'totalUnreads'
			])
		}
	}
</script>
