<template>
	<div id="fc-modal">
		<!-- Uses Foundation Reveal Modal https://foundation.zurb.com/sites/docs/reveal.html -->
		<button v-if="!customTrigger && !customTarget" class="btn btn-default" :data-open="getTarget">{{text}}</button>
		<div v-if="customTrigger && !customTarget" :data-open="getTarget" v-html="customTrigger"></div>
		<div class="reveal" :id="getTarget" data-reveal>
			<fc-login v-if="this.type == 'login'"></fc-login>
			<div v-else-if="this.type == 'custom'" v-html="content"></div>
			<slot v-pre v-else></slot>
			<button style="display: none;" data-close type="button">Close</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-modal',
		props: {
			text: { default: "Button" },
			content: { default: "" },
			type: { default: "" },
			customTrigger: { default: "" },
			customTarget: { default: "" }
		},
		data() {
			return {};
		},
		computed: {
			getTarget() {
			return this.customTarget || `modal-${this._uid}`;
			}
		},
		created() {
			// For modals that contain forms that submit via AJAX and handle responses with Callout component
			// Prevents callouts from being obscured by modal background overlay
			this.$bus.$on('alert', (data) => {

				// Reference to actual Foundation Reveal modal element
				const fReveal = $(`#${this.getTarget}`);

				// If modal is open
				if (fReveal.attr('aria-hidden') === 'false' && data.level === 'success') {
					// Unfortunate workaround for the fact that foundation's close method appears to be unavailable
					// in our project (guessing a missing library (modal requires motion-ui))
					fReveal.find('button').trigger('click');
				}
			});
		}
	};
</script>
