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
				<fc-form action="/api/messaging/send">
					<input name="threadIdentifier" :value=getIdentifier type="hidden" />
					<textarea name="body" rows="10" required></textarea>
					<!-- For some reason, using a button element triggers submit twice, but input doesn't -->
					<input class="btn btn-default" type="submit" value="Send">
				</fc-form>
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
			customTrigger: { default: ''}
		},
		data() {
			return {};
		},
		computed: {
			getIdentifier() {
				return JSON.stringify({
					type: this.topicType,
					id: this.topicId
				});
			}
		}
	}
</script>
