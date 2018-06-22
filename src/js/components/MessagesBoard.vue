<template>
	<div class="message-list-item-details">
		<div class="message-list-item-details-sidebar">
			<ul class="message-list-item-details-participants">
				<!-- TODO Necessary to set a key here? Any risk of vue wrongfully reusing elements here? -->
				<li v-for="thread in threads" :key="thread.id" class="message-list-item-details-participant">
					<span class="chat-message-avatar" v-bind:style="{ background: color(thread.user.id) }"></span>
					{{thread.user.username}}
					<span class="unread-amount">{{thread.unreadCount || null}}</span>
				</li>
			</ul>
		</div>
		<div class="message-list-item-details-chat">
			<fc-messages v-bind:messages="currentMessages" v-bind:you="you"/>
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

	import { mapGetters, mapActions } from 'vuex';

	export default {
		name: 'fc-messages-board',
		data() {
			return {
			}
		},
		computed: {
			you() {
				return this.currentThread.user;
			},
			threads() {
				return this.currentTopic.threads;
			},
			...mapGetters([
				'me',
				'currentThread',
				'currentTopic',
				'currentMessages'
			])
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
