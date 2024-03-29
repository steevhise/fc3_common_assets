<template>
	<div class="message-list-item-details-chat-window" ref="chatWindow">
    <div v-if="disabled" class="disabled-overlay">
      {{ `Closed to replies as this item is taken or received.` }}
    </div>
		<!-- categoryIndex 4 represents our Notifications tab (see fc3_main, MessagesBoardConnected component) -->
		<h3 v-if="category && category.categoryIndex === 4" class="row columns  large-1">{{ t(category.displayName) }}</h3>
		<p v-if="category && category.categoryIndex === 4"></p>
		<div v-for="message in messages" v-bind:key="message.id" class="message-list-item-details-chat-message" v-bind:class="{ 'message-from-self': message.sender && message.sender.id === me.id }">
			<p class="chat-message-from" v-bind:class="{ 'message-from-self': message.sender && message.sender.id === me.id }">
				<span class="chat-message-avatar" v-bind:style="{ background: color(message.sender && message.sender.id) }"></span>
				<span v-if="message.sender"><a class="userlink" target="_blank" :href="`/member/${message.sender.username}`">{{ message.sender.username }}</a></span>&nbsp;<span v-if="message.sender && message.sender.privilege" v-bind:style="{ color: color(message.sender.privilege) }">({{ message.sender.privilege === 4 ? t('Lead Moderator') : t('Moderator') }})</span>
				<span v-if="!message.sender">{{ t('system notifier') }}</span>&nbsp;
			</p>
			<p class="chat-message-message" v-if="!showHtml" v-bind:style="messageStyle(message)">{{message.body}}</p>
			<p class="chat-message-message" v-if="showHtml" v-html="message.body" v-bind:style="messageStyle(message)"></p>
			<p class="chat-message-time" v-bind:class="{ 'message-from-self': message.sender && message.sender.id === me.id }">{{ago(timezone(message.createdAt))}}</p>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';

	export default {
		name: 'fc-messages',
		props: {
		  category: Object,
      disabled: Boolean,
			messages: Array,
			me: Object,
			showHtml: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
			}
		},
		mounted() {

			// Sets window to bottom of conversation, so user sees most recent message
			// on opening a thread and on sending a message
			const { chatWindow } = this.$refs;
			chatWindow.scrollTop = chatWindow.scrollHeight;
			moment.locale(window.language);    // language set in top-level... apparently we can't use this.i18nOptions.lng here?
		},
		methods: {
			ago: (time) => !isNaN(time) ? moment(time).fromNow() : '',    // TODO???
			timezone: (datetime) => {
				// datetime values from server are in UTC
				const utc = new Date(datetime);
				const milli = +utc;
				const localOffset =  utc.getTimezoneOffset() * 60 * 1000;

				return milli - localOffset;
			},
			color: (id) => colors[id % colors.length],
			messageStyle: (message) => !message.sender && { display: 'inline-block !important' }
		}
	}

	// TODO dry-up with MessagesBoard component
	const colors = [
		'rgb(186,104,200)',
		'rgb(255,167,38)',
		'rgb(175,180,43)',
		'rgb(38,166,154)',
		'rgb(236,64,122)',
		'rgb(255,213,79)',
		'rgb(126,87,194)'
	]
</script>

<style lang="css">
.disabled-overlay {
  color: #fff;
  background: #00000080;
  width: 110%;
  height: 110%;
  margin-left: -5%;
  margin-top: -5%;
  font-weight: bold;
  position: absolute;
  text-align: center;
  padding-top: 24%;
  z-index: 999;
  text-shadow: 1px 1px 2px #000;
  text-transform: uppercase;
}

.userlink {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: #34b233;
}

</style>
