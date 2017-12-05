<template>
	<div id="fc-modal">
		<button class="btn btn-default" :data-open="getTarget">{{text}}</button>
		<div class="reveal" :id="getTarget" data-reveal>
			<fc-login v-if="this.type == 'login'"></fc-login>
			<div v-else-if="this.type == 'custom'" v-html="content"></div>
			<slot v-pre v-else></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-modal',
		props: {
			text: { default: "Button" },
			content: { default: "" },
			type: { default: "" }
		},
		data() {
			return {};
		},
		computed: {
			getTarget() {
			return `modal-${this._uid}`;
			}
		}
	};
</script>