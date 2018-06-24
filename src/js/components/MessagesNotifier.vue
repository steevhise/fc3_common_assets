<template>
	<span id="fc-messages-notifier" :class="computedClass">
		{{totalUnreads}}
	</span>
</template>

<script>
	export default {
		name: 'fc-messages-notifier',
		props: {
			userId: null
		},
		data() {
			return {
				totalUnreads: this.$store.getters.totalUnreads
			}
		},
		computed: {
			computedClass() {
				if (this.totalUnreads > 0) {
					return "pulse"
				}
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>