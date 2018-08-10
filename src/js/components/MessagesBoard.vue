<template>
	<div>
		<!-- data-close comes from Foundation's Reveal modal (part of enclosing fc-modal component on my replies page
			 no-op if component isn't used within a modal -->
		<div @click="onClickClose" :style="{ position: 'absolute', top: 0, left: 0 }" data-close >X</div>
		<div v-if="topic" class="message-list-item-header">
			<h4 v-if="topic.topic.type !== 'post'">{{title(topic)}}</h4>
			<div  class="message-list-item-post-icon" v-if="topic.topic.type === 'post'">

				<h4>{{title(topic)}}</h4>    <!-- for now - later topic will be covered by below -->

				<!-- // TODO: make the header look like the standard post list item. i can't get it to work but below is a start.
				 {{ console.log(topic.topic) }}
				<fc-data :item="topic.topic" context="posts" :viewer="1" component="fc-post-list-item" :path="topic.topic.post.path"></fc-data>
-->
				<fc-post-icon :post="topic.topic.post" />
			</div>
		</div>
		<div class="message-list-item-details">
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

			<div class="message-list-item-details-chat" v-if="loadingThreads" >
				<fc-spinner size="huge" message="Loading..."></fc-spinner>
			</div>

			<div v-else class="message-list-item-details-chat">
				<fc-messages
					:style="{
						height: '425px',
						overflowY: 'scroll'
					}"
					:messages="messagesInit"
					:me="me"
				/>
				<div class="message-list-item-details-chat-form">
					<form ref="messageForm" @submit.prevent="handleSubmit">
						<input type="text" ref="messageBody" placeholder="Write a Message (1000 characters max)" maxlength="1000" required>
						<fc-spinner v-if="sendingMessage" size="medium" message="Sending..."></fc-spinner>
						<button class="btn-default" v-else>Send</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { topicTitle } from './helpers';

	export default {
		name: 'fc-messages-board',
		props: {
			topic: Object,
			threads: Array,
			messages: Array,
			me: Object,
			onClickThread: Function,
			onClickClose: Function,
			onSubmitMessage: Function,
			selectedThread: Object
		},
		data() {
			return {
				// controls the state of a message being sent for the spinner
				sendingMessage: false,
				loadingThreads: false
			}
		},
		created() {
			let self = this;
			this.$bus.$on('threads.loading', () => {
				this.loadingThreads = true;
			});
			this.$bus.$on('threads.done', () => {
				this.loadingThreads = false;
			});
		},
		computed: {
			messagesInit() {

				return this.messages.length > 0 ? this.messages : [{ id: 0, body: 'There are no messages in this thread yet.'}];
			}
		},
		methods: {
			color: (id) => colors[id % colors.length],
			title: topicTitle,
			handleSubmit() {
				let self = this;
				self.sendingMessage = true;

				const body = this.$refs.messageBody.value;
				const form = this.$refs.messageForm;

				return this.onSubmitMessage(body)
				.then(() => {
					form.reset();
					self.sendingMessage = false;
				});
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
