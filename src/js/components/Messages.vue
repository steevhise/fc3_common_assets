<template>
	<div>
		<div class="message-list-item-details-chat-window">
			<div v-for="message in messages" v-bind:key="message.id" class="message-list-item-details-chat-message" v-bind:class="{ 'message-from-self': message.sender.id === me.id }">
				<p class="chat-message-from">
					<span class="chat-message-avatar" v-bind:style="{ background: color(message.sender.id) }"></span>
					{{ message.sender.username }}
				</p>
				<p class="chat-message-message">{{message.body}}</p>
				<p class="chat-message-time">{{ago(timezone(`${message.createdAt} ${message.sentTime}`))}}</p>
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
			me: Object
		},
		data() {
			return {
			}
		},
		methods: {
			ago: (time) => moment(time).fromNow(),
			timezone: (datetime) => {
				// datetime values from server are in UTC
				const utc = new Date(datetime);
				const milli = +utc;
				const localOffset =  utc.getTimezoneOffset() * 60 * 1000;

				return milli - localOffset;
			},
			color: (id) => colors[id % colors.length]
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
