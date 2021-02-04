<template>
	<div id="fc-messages-detail-input" >
		<div v-if="customTrigger" :data-open="getTarget" v-html="customTrigger" v-on:click="onClickModalTrigger()"></div>
		<div class="reveal" :id="getTarget" data-reveal>
			<div>
				<div class="inputTitle">
					<!-- Customizable holder for input title e.g.
						To user: Message to {{ username }}
						To post: Message to {{ username }} about {{ post title }}
						To group: Message {{ groupname }} moderators
					-->
					<slot></slot>
				</div>
				<!-- TODO: finish the custom default message body stuff -->
				<fc-form action="/api/messaging/send" :custom-alert-el="_uid" ref="msgForm" >
					<input name="subject" type="hidden" v-bind:value="this.subject" />
					<input name="threadIdentifier" :value=getIdentifier type="hidden" />
					<input type="text" name="body" v-bind:value="this.defaultBody" required @input="checkCharCount($event)" />
					<!-- For some reason, using a button element triggers submit twice, but input doesn't -->
					<input class="btn btn-default" type="submit" :value="t('Send')" />
				</fc-form>
				<div>
		<p class="charCounter"><strong>{{ t('Character Count') }}:</strong> {{ charCount }} / {{ limit }} {{ t('characters allowed') }}</p>
				</div>
			</div>
			<button style="display: none;" data-close type="button">{{ t('Close') }}</button>
		</div>
	</div>
</template>

<script>

	import _ from 'lodash';

	export default {
		name: 'fc-messages-detail-input',
		props: {
			topicType: String,
			topicId: String,           // if zero then what? might be trying to report a user but they dont have a home group.
		    defaultBody: String,
			subject: String,
			customTrigger: { default: ''},
			limit: { default: 998 }
		},
		data() {
			return {
				charCount: 0,
				reveal: {
					type: Object,
					default: () => {}
				}
			};
		},
		created() {
			this.$bus.$on(`formSuccess-${this._uid}`, (data) => {

				const { message } = data;
				this.charCount = 0;
				this.$bus.$emit('alert', { level : 'success', message, timer: 20000 });
			});

			// For modals that contain forms that submit via AJAX and handle responses with Callout component
			// Prevents callouts from being obscured by modal background overlay
			this.$bus.$on('alert', (data) => {

				// Easier logic for elements manually instantiated (see mounted() )
				if (this.reveal.close) {
					return this.reveal.close();
				}

				// Reference to actual Foundation Reveal modal element
				const fReveal = $(`#${this.getTarget}`);

				// If modal is open
				if (fReveal.attr('aria-hidden') === 'false' && data.level === 'success') {
					// Unfortunate workaround for the fact that foundation's close method appears to be unavailable
					// in our project (guessing a missing library (modal requires motion-ui))
					fReveal.find('button').trigger('click');
				}
			});

		},
		mounted() {

			/**
				Sorry this is extra funky :(

				Handles the cases where this component may be displayed within a list view, but
				not immediately visible e.g. a post in a post list beyond the first 10 posts, revealed
				on the user clicking "Load More". It looks like on page load, Foundation's Reveal module finds all
				elements marked up as it expects and turns those into modals (see https://foundation.zurb.com/sites/docs/reveal.html).
				This routine picks up only those elements that are actually part of the DOM at runtime i.e. not our
				unloaded list items. So, we manually instantiate Reveal modals using elements as loaded

				For elements already in the DOM, Foundation hasn't been loaded into the current window yet, so the below
				instantiation would fail. Fortunately, we can safely fallback to Foundation's load routine in those cases
			**/
			if (window.Foundation) {
				this.reveal = new Foundation.Reveal($(`#${this.getTarget}`));
			}
		},
		computed: {
			getIdentifier() {
				return JSON.stringify({
					type: this.topicType,
					id: this.topicId
				});
			},
			getTarget() {
				return `modal-${this._uid}`;
			}
		},
		methods: {
			checkCharCount(event) {

				const input = event.target;
				const textContent = event.target.value;
				this.defaultBody = textContent;
				this.charCount = textContent.length;
				this.updateCharCountDisplay(this, input);
			},
			updateCharCountDisplay: _.debounce((v, input) => {

				// Actual form is nested within the elements created by Foundation's Reveal Modal, not the template structure above
				const modalId = $(v.$el).find('div[data-open]').first().attr('data-open');
				const display = $(`#${modalId}`).find('.charCounter');

				if (v.charCount > v.limit) {
					display.css('color', 'red');
					input.setCustomValidity(`${t('Message must be less than')} ${v.limit} ${t('characters')}`);
				} else {
					display.css('color', 'black');
					input.setCustomValidity('');
				}
			}, 500),
			onClickModalTrigger() {

				if (this.reveal.open) {
					return this.reveal.open();
				}

				// Automatically instantiated modals (see note in mounted() )
				// use Foundation's methods automatically
				return;
			}
		}
	}
</script>
