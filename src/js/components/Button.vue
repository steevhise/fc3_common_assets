<template>
	<button :class="`${cPallete} ${this.$attrs.class}`" v-bind="$attrs">
		<slot></slot>
	</button>
</template>

<script>
	/**
	 * This is a smart component that enables the ability to use colors from the styleguide.
	 * Simply use default, offer, action, wanted, lend, or borrow to pull in the styling from the comp.
	 * If you want to use a different color, you can pass an alternative class or simply use a style tag to overwrite any defaults.
	 * This is so far not used at all, i guess? weird. And doesn't seem to work... maybe Ryan started building this but never got it finished. :(
	 */
	export default {
		name: 'fc-button',
		props: {
			// comp colors include default, offer, action, wanted, lend, borrow
			color: { type: String, default: 'default' }
		},
		computed: {
			cPallete() {
				console.debug('btn-'+ this.color);
				return `btn btn-${this.color}`;
			}
		}
	}
</script>
