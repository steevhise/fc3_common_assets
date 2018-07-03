<template>
	<span id="fc-messages-notifier" :class="{ pulse : unreadRepliesCount }">
		{{ unreadRepliesCount }}
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
