<template>
    <fc-modal custom-target="lend-message-form" custom-trigger="<div id='lendMessageTrigger' style='display: none;'></div>">
        <h3>You lent your item! Want to notify your friend?</h3>
        <p>Send them a short message to keep in touch about the borrowed item</p>
        <fc-form v-if="post && lendThreadId" action="/api/messaging/send"
			:custom-alert-el="this._uid"
			ref="lendMessageForm"
		>
            <label>Message (1000 characters max)</label>
            <input type="text"
                maxlength="1000"
                required
				name="body"
                :value="`You're now borrowing &quot;${post.subject}&quot;. Don't forget to bring it back!`"
            >
            <input type="hidden" name="threadIdentifier" :value="lendThreadId" />
            <input type="submit" class="btn-default" value="Send" />
            <button class="btn btn-alert" type="button" data-close >Don't Send A Message Right Now</button>
        </fc-form>
    </fc-modal>
</template>

<script>

	export default {
		name: 'fc-lend-message',
		props: {},
		data() {
			return {
				post: {
					type: Object,
					default: () => null
				},
				lendThreadId: null
			};
		},
		created() {

			this.$bus.$on(`formSuccess-${this._uid}`, () => {

				this.$refs.lendMessageForm.$el.reset();
				this.$bus.$emit('alert', { level : 'success', message: 'Message sent!', timer: 20000 })
			});
		}
	}
</script>
