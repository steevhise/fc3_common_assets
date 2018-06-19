<template>
	<div>
		<div v-for="message in messages" class="message-list-item-details-chat-window">
			<div class="message-list-item-details-chat-message" v-bind:class="{ 'message-from-self': message.userId === me.id }">
				<p class="chat-message-from">
					<span class="chat-message-avatar" v-bind:style="{ background: color(message.userId) }"></span>
					{{user(message.userId).username}}
				</p>
				<p class="chat-message-message">{{message.body}}</p>
				<p class="chat-message-time">{{ago(message.updatedAt)}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';

	export default {
		name: 'fc-messages',
		props: {
			messages: Array,
			me: Object,
			you: Object
		},
		data() {
			return {
			}
		},
		methods: {
			ago: (time) => moment(time).fromNow(),
			color: (id) => colors[id % colors.length],
			user(userId) {

				if (userId === this.me.id) {
					return this.me;
				}
				else if (userId === this.you.id) {
					return this.you;
				}

				return null;
			}
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
