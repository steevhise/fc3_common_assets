<template>
	<div id="fc-loading" v-if="isLoading" data-closable="slide-out-right" class="pulse">
		<h5 v-if="header">{{header}}</h5>
		<p v-html="message" v-if="message" ></p>
	</div>
</template>

<script>
	export default {
		name: 'fc-loading',
		data() {
			return {
				isLoading: false,
				timer: 6000, // time in ms
				message: null,
				header: 'Loading Please Wait ...',
				queue: []
			}
		},
		created() {
			this.$bus.$on('loading.add', () => {
				this.queue.push(new Date());
			});
			this.$bus.$on('loading.remove', () => {
				this.queue.unshift();
			});
		},
		watch: {
			queue(val) {
				if (val.length > 0) {
					this.isLoading = true;
				} else {
					this.isLoading = false;
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	#fc-loading {
		text-align: center;
	}
</style>
