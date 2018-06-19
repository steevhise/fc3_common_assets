<template>
	<div id="fc-messages-detail-input">
		<fc-modal :custom-trigger="customTrigger" >
			<div>
				<div class="inputTitle">
					<!-- Customizable holder for input title e.g.
						To user: Message to {{ username }}
						To post: Message to {{ username }} about {{ post title }}
						To group: Message {{ groupname }} moderators
					-->
					<slot></slot>
				</div>
				<fc-form action="/api/messaging/send" @submit.prevent="handleSubmit($event)">
					<input name="threadIdentifier" :value=getIdentifier type="hidden" />
					<textarea name="body" rows="15" required @input="checkCharCount($event)"></textarea>
					<!-- For some reason, using a button element triggers submit twice, but input doesn't -->
					<input class="btn btn-default" type="submit" value="Send">
				</fc-form>
				<div>
					<p class="charCounter"><strong>Character Count: </strong>{{ charCount }} / {{ limit }} characters allowed</p>
				</div>
			</div>
		</fc-modal>
	</div>
</template>

<script>
	export default {
		name: 'fc-messages-detail-input',
		props: {
			topicType: String,
			topicId: Number,
			customTrigger: { default: ''},
			limit: { default: 1000 }
		},
		data() {
			return {
				charCount: 0
			};
		},
		computed: {
			getIdentifier() {
				return JSON.stringify({
					type: this.topicType,
					id: this.topicId
				});
			}
		},
		methods: {
			checkCharCount(event) {

				const input = event.target;
				const textContent = event.target.value;
				this.charCount = textContent.length;
				// Actual form is nested within the elements created by Foundation's Reveal Modal, not the template structure above
				const modalId = $(this.$el).find('div[data-open]').first().attr('data-open');
				const display = $(`#${modalId}`).find('.charCounter');

				if (this.charCount > this.limit) {
					display.css('color', 'red');
					input.setCustomValidity(`Message must be less than ${this.limit} characters`);
				} else {
					display.css('color', 'black');
					input.setCustomValidity('');
				}
			}
		}
	}
</script>
