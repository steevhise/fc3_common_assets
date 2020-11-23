<template>
	<span id="fc-help">
		<i class="fa fa-question-circle fc-help-trigger" data-open="fc-help-reveal" :style="`color: ${fontcolor}`" ></i>
		<div class="reveal" id="fc-help-reveal" data-reveal>
			<h3>Freecycle Help</h3>
			<slot>Freecycle Help Placeholder. Presumably some intro text to ease users into the the Beacon is provided?</slot>
			<br/>
			<a href="#" class="button fc-help-beacon-trigger" @click.prevent="openBeacon" >Open Help Scout Beacon</a>
      <button id="fc-help-reveal-close" style="display: none;" data-close type="button">{{ t('Close') }}</button>
		</div>
	</span>
</template>

<script>
	export default {
		name: "fc-help",
    methods: {
      openBeacon() {
        $('#fc-help-reveal-close').click()
        window.openBeacon()
      }
    }
	}
</script>

<style scoped>
  .fc-help-trigger {
    color: gray;
    cursor: pointer;
    font-size: 32px;
		position:fixed;
		bottom: 16px;
		right: 16px;
	}
	.fc-help-beacon-trigger {
		float: right;
		clear: both;
	}
</style>
