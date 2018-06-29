<template>
	<div class="message-list-item-details">
		<!-- data-close comes from Foundation's Reveal modal (part of enclosing fc-modal component on my replies page
			 no-op if component isn't used within a modal -->
		<div @click="onClickClose" :style="{ position: 'absolute', top: 0, left: 0 }" data-close >X</div>
		<div v-if="threads && threads.length > 1" class="message-list-item-details-sidebar">
			<ul class="message-list-item-details-participants">
				<li v-for="thread in threads" :key="thread.id" @click="onClickThread(thread.id)"
					class="message-list-item-details-participant" v-bind:class="{ active: selectedThread && (selectedThread.id === thread.id) }"
				>
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
			/>
			<div class="message-list-item-details-chat-form">
				<form ref="messageForm" @submit.prevent="handleSubmit">
					<textarea ref="messageBody" placeholder="Write a Message.."></textarea>
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
			selectedThread: Object,
			messages: Array,
			me: Object,
			onClickThread: Function,
			onClickClose: Function,
			onSubmitMessage: Function
		},
		data() {
			return {}
		},
		methods: {
			color: (id) => colors[id % colors.length],
			handleSubmit() {

				const body = this.$refs.messageBody.value;
				const form = this.$refs.messageForm;

				return this.onSubmitMessage(body)
				.then(() => form.reset());
			}
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
