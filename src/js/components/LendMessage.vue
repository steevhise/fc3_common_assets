<template>
    <fc-modal custom-target="lend-message-form" custom-trigger="<div id='lendMessageTrigger' style='display: none;'></div>">
        <h3>{{ t("You lent your item! Want to notify your friend?") }}</h3>
        <p>{{ t("Send them a short message to keep in touch about the borrowed item") }}</p>
        <fc-form v-if="post && lendThreadId" action="/api/messaging/send"
          :custom-alert-el="this._uid"
          ref="lendMessageForm"
        >
            <label>{{ t("Message (1000 characters max)") }}</label>
            <input type="text"
                maxlength="1000"
                required
                name="body"
                :value="formatLendMessage(post)"
            >
            <input type="hidden" name="threadIdentifier" :value="lendThreadId" />
            <input type="submit" class="btn-default" :value="t('Send')" />
            <button class="btn btn-alert" type="button" data-close >{{ t("Don't Send A Message Right Now") }}</button>
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
			this.$bus.$emit('alert', { level : 'success', message: this.t("Message sent!"), timer: 20000 })
		});
	},
  mounted() {
    $('#lend-message-form').foundation();   // initialize foundation on this element, so we can be ready to open the modal
  },
  methods: {
	  formatLendMessage(post) {
      `${this.t("You're now borrowing")} "${post.subject}". ${this.t("Don't forget to bring it back!")}`
    }
	}
}
</script>
