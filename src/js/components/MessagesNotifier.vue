<template>
	<span id="fc-messages-notifier" :class="{ 'bg-light-gray' : unreadRepliesCount }">
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
