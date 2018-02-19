<template>
	<div id="fc-help">
		<p>{{slot}}</p>
	</div>
</template>

<script>
	export default {
		name: "fc-help",
		data() {
			return {

			}
		},
		mounted() {
			console.log("fc-help loaded");
		}
	}
</script>

<style scoped>

</style>