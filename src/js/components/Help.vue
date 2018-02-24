<template>
	<span id="fc-help">
		<i class="fa fa-question-circle fc-help-trigger" :data-open="getTarget" :style="`font-size: ${fontsize}; color: ${fontcolor}`" ></i>
		<div class="reveal" :id="getTarget" data-reveal>
			<h3>Freecycle Help</h3>
			<slot>Freecycle Help Placeholder</slot>
			<!--TODO: Add HelpScout Beacon-->
		</div>
	</span>
</template>

<script>
	export default {
		name: "fc-help",
		props: {
			fontsize: { default: '15px' },
			fontcolor: { default: 'gray' }
		},
		data() {
			return {
				
			}
		},
		computed: {
			getTarget() {
				return `modal-${this._uid}`
			}
		}
	}
</script>

<style scoped>
	.fc-help-trigger {
		position:relative;
		bottom: 0px;
		right: 5px;
	}
</style>