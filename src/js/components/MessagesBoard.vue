<template>
	<div class="message-list-item-details">
		<div class="message-list-item-details-sidebar">
			<ul class="message-list-item-details-participants">
				<li v-for="thread in threads" class="message-list-item-details-participant">
					<span class="chat-message-avatar" v-bind:style="{ background: color(thread.user.id) }"></span>
					{{thread.user.username}}
					<span class="unread-amount">{{thread.unreadCount || null}}</span>
				</li>
			</ul>
		</div>
		<div class="message-list-item-details-chat">
			<fc-messages v-bind:messages="messages" v-bind:me="me" v-bind:you="you"/>
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
			threads: {
				type: Array,
				default: [ // TODO remove
					{ id: 10, user: { id: 42, username: 'devinivy' }, unreadCount: 0 },
					{ id: 11, user: { id: 69, username: 'zack' }, unreadCount: 10 }
				]
			},
			messages: {
				type: Array,
				default: [ // TODO remove
					{ id: 10, userId: 42, body: 'Hey!', updatedAt: '2018-06-12T19:18:46.030Z' },
					{ id: 11, userId: 69, body: 'What is goin on?!', updatedAt: '2018-06-17T19:18:46.030Z' },
					{ id: 12, userId: 42, body: 'Nothing is going on!', updatedAt: '2018-06-18T19:18:46.030Z' },
					{ id: 13, userId: 69, body: 'Hey!', updatedAt: '2018-06-19T19:18:46.030Z' }
				]
			}
		},
		data() {
			return {	// TODO remove
				me: { id: 42, username: 'devinivy' },
				you: { id: 69, username: 'zack' }
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
