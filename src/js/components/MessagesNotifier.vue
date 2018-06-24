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

		}
	}
</script>