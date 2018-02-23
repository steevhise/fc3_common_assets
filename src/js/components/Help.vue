<template>
	<div id="fc-help">
		<slot></slot>
		<fc-modal id="2" text="Modal" type="custom" >
			<slot name="trigger">Hello World</slot>
		</fc-modal>
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