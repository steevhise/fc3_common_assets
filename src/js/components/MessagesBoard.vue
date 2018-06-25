<template>
	<div class="message-list-item-details">
		<div class="message-list-item-details-sidebar">
			<ul class="message-list-item-details-participants">
				<li v-for="thread in threads" :key="thread.id" class="message-list-item-details-participant">
					<span class="chat-message-avatar" v-bind:style="{ background: color(thread.user.id) }"></span>
					{{thread.user.username}}
					<span class="unread-amount">{{thread.unreadCount || null}}</span>
				</li>
			</ul>
		</div>
		<div class="message-list-item-details-chat">
			<fc-messages
				v-bind:messages="messages"
				v-bind:me="me"
				v-bind:you="you"
			/>
			<div class="message-list-item-details-chat-form">
				<form>
					<textarea placeholder="Write a Message.."></textarea>
					<button class="btn-default">Send</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-messages-board',
		props: {
			threads: Array,
			messages: Array,
			me: Object,
			you: Object
		},
		data() {
			return {
			}
		},
		methods: {
			color: (id) => colors[id % colors.length],
		}
	}

	// TODO dry-up with Messages component
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
