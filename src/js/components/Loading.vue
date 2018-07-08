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
				header: 'Loading Please Wait ...'
			}
		},
		created() {
			this.$bus.$on('loading', (data) => {
				this.init(data);
			});
		},
		methods: {
			init(data) {
				Object.assign(this, data);
				this.isLoading = true;
				setTimeout(() => {
					this.isLoading = false;
				}, this.timer);
			}
		}
	}
</script>

<style scoped>
	#fc-loading {
		text-align: center;
	}
</style>
