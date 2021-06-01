<template>
	<span id="fc-messages-notifier">
		{{ unreadRepliesCount || ' ' }}
	</span>
</template>

<script>
	export default {
		name: 'fc-messages-notifier',
		props: {
			unreadRepliesCount: Number
		},
		data() {
			return {}
		}
	}
</script>
