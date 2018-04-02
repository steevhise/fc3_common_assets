<template>
	<div id="fc-data">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name : 'fc-data',
		props : {
			limit: { type : Number, default : 10 },
			items: {}
		},
		data() {
			return {
				current : 0,
				localItems: this.items
			}
		},
		created() {
			
		},
		mounted() {
			
		}
	}
</script>