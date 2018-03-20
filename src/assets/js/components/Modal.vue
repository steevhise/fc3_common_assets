<template>
	<div id="fc-modal">
		<button v-if="!customTrigger" class="btn btn-default" :data-open="getTarget">{{text}}</button>
		<div v-if="customTrigger" :data-open="getTarget" v-html="customTrigger"></div>
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
			type: { default: "" },
			customTrigger: { default: "" }
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