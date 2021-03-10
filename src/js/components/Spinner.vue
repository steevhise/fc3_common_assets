<template>
	<div>
		<div class="vue-simple-spinner" :style="spinner_style"></div>
		<div class="vue-simple-spinner-text" :style="text_style" v-if="message.length > 0">{{ message }}</div>
	</div>

<!--	// {{ t('Loading...') }}  // cuz of dumb i18n-parser
{{ t('Searching...') }}
-->
</template>

<script>
	/**
	 * @author: dzwillia
	 * @credits: https://github.com/dzwillia/vue-simple-spinner
	 */

	var isNumber = function (n) {
		return !isNaN(parseFloat(n)) && isFinite(n)
	};

	export default {
		name: 'fc-spinner',
		props: {
			'size': {
				// either a number (pixel width/height) or 'tiny', 'small',
				// 'medium', 'large', 'huge', 'massive' for common sizes
				default: 'large'
			},
			'line-size': {
				type: Number,
				default: 4
			},
			'line-bg-color': {
				type: String,
				default: '#eee'
			},
			'line-fg-color': {
				type: String,
				default: '#34b233' // match .blue color to Material Design's 'Blue 500' color
			},
			'speed': {
				type: Number,
				default: 0.8
			},
			'spacing': {
				type: Number,
				default: 4
			},
			'message': {
				type: String,
				default: ''
			},
			'font-size': {
				type: Number,
				default: 13
			},
			'text-fg-color': {
				type: String,
				default: '#555'
			}
		},
		computed: {
			size_px() {
				switch (this.size) {
					case 'tiny': return 12
					case 'small': return 16
					case 'medium': return 32
					case 'large': return 48
					case 'big': return 64
					case 'huge': return 96
					case 'massive': return 128
				}

				return isNumber(this.size) ? this.size : 32
			},
			line_size_px() {
				switch (this.size) {
					case 'tiny': return 1
					case 'small': return 2
					case 'medium': return 5
					case 'large': return 10
					case 'big': return 15
					case 'huge': return 20
					case 'massive': return 50
				}

				return isNumber(this.lineSize) ? this.lineSize : 4
			},
			text_margin_top() {
				switch (this.size) {
					case 'tiny':
					case 'small':
					case 'medium':
					case 'large':
					case 'big':
					case 'huge':
					case 'massive':
						return Math.min(Math.max(Math.ceil(this.size_px / 8), 3), 12)
				}

				return isNumber(this.spacing) ? this.spacing : 4
			},
			text_font_size() {
				switch (this.size) {
					case 'tiny':
					case 'small':
					case 'medium':
					case 'large':
					case 'big':
					case 'huge':
					case 'massive':
						return Math.min(Math.max(Math.ceil(this.size_px * 0.4), 11), 32)
				}

				return isNumber(this.fontSize) ? this.fontSize : 13
			},
			spinner_style() {
				return {
					'margin': '0 auto',
					'background-color': 'white',
					'border-radius': '100%',
					'border': this.line_size_px + 'px solid ' + this.lineBgColor,
					'border-top': this.line_size_px + 'px solid ' + this.lineFgColor,
					'width': this.size_px + 'px',
					'height': this.size_px + 'px',
					'animation': 'vue-simple-spinner-spin ' + this.speed + 's linear infinite'
				}
			},
			text_style() {
				return {
					'margin-top': this.text_margin_top + 'px',
					'background-color': 'white',
					'color': this.textFgColor,
					'font-size': this.text_font_size + 'px',
					'text-align': 'center',
					'position': 'relative',
					'z-index': 9
				}
			}
		}
	}
</script>

<style>
	.vue-simple-spinner {
		transition: all 0.3s linear;
		position: relative;
		z-index: 10;
	}

	@keyframes vue-simple-spinner-spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
