<template>
	<span id="fc-messages-notifier" :class="computedClass">
		{{totalUnreads}}
	</span>
</template>

<script>
	export default {
		name: 'fc-messages-notifier',
		props: {
			totalUnreads: Number
		},
		data() {
			return {
				unread: this.totalUnreads
			}
		},
		computed: {
			computedClass() {
				if (this.totalUnreads > 0) {
					return "pulse"
				}
			}
		},
		created() {

			// TODO Would this trigger this component to rerender?
			this.$bus.on('update:header-unread', (count) => {

				this.unread = count;
			});
		}
	}
</script>
