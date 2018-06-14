<template>
	<span id="fc-messages-notifier">{{getUnreadCount()}}</span>
</template>

<script>
	export default {
		name: 'fc-messages-notifier',
		props: {
			userId: null
		},
		data() {
			return {
				
			}
		},
		methods: {
			/**
			 * TODO: This is a stub that will eventually get the unread count from the messages endpoint.
			 * @returns {number}
			 */
			getUnreadCount() {

				return 12;
			}
		}
	}
</script>