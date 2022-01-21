<template>
	<div>
		<div class="vue-simple-spinner" :style="spinner_style"></div>
		<div class="vue-simple-spinner-text" :style="text_style" v-if="message.length > 0">{{ t(message) }}</div>
	</div>

<!--	// {{ t('Loading...') }}  // cuz of dumb i18n-parser
{{ t('Searching...') }}
  add more text needing translating here.
-->
</template>

<script>
	/**
	 * @author: dzwillia
	 * @credits: https://github.com/dzwillia/vue-simple-spinner
   *  additionally, we detect if we're spinning too long and say "oh sorry, something went wrong."
	 */

	var isNumber = function (n) {
		return !isNaN(parseFloat(n)) && isFinite(n)
	};

	export default {
    name: 'fc-spinner',
    data() {
      return {
        loadStartTime: null,  // this is when the spinner started spinning, since epoch
        isLoading: false,
        now: Date.now(),   // will this work? will it keep changing? apparently not.
        timer: null
      }
    },
    props: {
      'size': {
        // either a number (pixel width/height) or 'tiny', 'small',
        // 'medium', 'large', 'huge', 'massive' for common sizes
        default: 'large'
      },
      'timeOut': {
        type: Number,
        default: 10000,    // default time in milliseconds we let the spinner spin
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
        default: '#34b233' // green
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
          case 'tiny':
            return 12
          case 'small':
            return 16
          case 'medium':
            return 32
          case 'large':
            return 48
          case 'big':
            return 64
          case 'huge':
            return 96
          case 'massive':
            return 128
        }

        return isNumber(this.size) ? this.size : 32
      },
      line_size_px() {
        switch (this.size) {
          case 'tiny':
            return 1
          case 'small':
            return 2
          case 'medium':
            return 5
          case 'large':
            return 10
          case 'big':
            return 15
          case 'huge':
            return 20
          case 'massive':
            return 50
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
    },
    mounted() {

      // watch ourselves to see if we're visible
      this.observer = new IntersectionObserver(entries => {
        let entry = entries[0]

        // or if there's more than one, find the one we want.
        if (entries.length > 1) {
          const intersectingEntry = entries.find(e => e.isIntersecting)
          if (intersectingEntry) {
            entry = intersectingEntry
          }
        }

        // we're transitioning to invisible
        if (!entry.isIntersecting) {
          this.loadStartTime = null;
          this.isLoading = false;
          clearInterval(this.timer);  // if we're not loading, we dont need to keep counting.
          return;
        }

        // otherwise we're becoming visible so set the time we became visible
        this.loadStartTime = Date.now();   // or use entry.time somehow???
        this.isLoading = true;

        // now start a timer that increments "now"
        this.timer = setInterval(() => {
          this.now = Date.now();
          // console.debug('now isloading ' + this.isLoading)

        }, 10)

      }, {
        threshold: 0.0      // as soon as it's at all visible or invisible
      });

      this.observer.observe(this.$el);
    },
    watch: {
      // we want to constantly check if we're visible.
      now: function (val, oldVal) {
        // console.debug('time', val, 'load start', this.loadStartTime);
        const duration = Number(Date.now() - this.loadStartTime);
        // console.debug(`we be spinning for ${duration}ms. the timeout is ${this.timeOut}`, this.loadStartTime, this.isLoading, (duration > this.timeOut));
        if (this.isLoading && (duration > this.timeOut)) {
          this.size = 'medium';
          this.message = 'hmm, sorry this is taking so long...';
          // console.debug('time out!')

          // now wait a little longer
          const moreWaiting = setTimeout( () => {
            this.size = 'small';
            this.lineFgColor = 'orange';
            this.message = 'Looks like something has gone wrong. Sorry! Please reload this page and try again. If you still have trouble, contact support.';
            // console.debug('waited more');
            this.isLoading = false;
            this.loadStartTime = null;
          }, this.timeOut);
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
