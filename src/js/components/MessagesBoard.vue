<template>
	<div><!-- data-close comes from Foundation's Reveal modal (part of enclosing fc-modal component on my replies page no-op if component isn't used within a modal -->
		<div @click="onClickClose" style="position: absolute; top: 0; right: 10px; z-index: 1000" data-close >
			<i class="fa fa-times-circle" style="margin: 10px; font-size: 22px; color: #34b233; cursor: pointer;" ></i>
		</div>
		<div v-if="topic" class="message-list-item-header">
			<h4 v-if="topic.topic.type !== 'post'">{{ title(topic) }}</h4>
			<div class="message-list-item-post-icon post-list-item" v-if="topic.topic.type === 'post'" style="width: 100%;">
				<div class="grid-x small-12 align-center-middle">
					<div class="columns small-2 left">
						<fc-post-icon :post="topic.topic.post" />
					</div>
					<div class="columns small-10 left">
						<a :href="'/posts/' + topic.topic.post.id"><h4 :title="title(topic)" :alt="title(topic)">{{ title(topic) }}</h4></a>
						<span class="post-list-item-header-icon" v-if="topic.topic.post.group_id">
									<fc-icon name="map_pin"></fc-icon><span>{{ group(topic) }}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="message-list-item-details">
			<div v-if="threads && threads.length > 1" class="message-list-item-details-sidebar">
				<ul class="message-list-item-details-participants">
					<li class="message-list-item-details-participant"
              v-for="thread in threads"
              v-bind:class="{ active: selectedThread && (selectedThread.id === thread.id) }"
              v-if="thread.user != null"
              :key="thread.id"
              @click="onClickThread(thread.id)">
						<span class="chat-message-avatar" v-bind:style="{ background: color(thread.user.id) }"></span>
						{{thread.user.username}}
						<span class="unread-amount">{{ thread.unreadCount || null }}</span>
					</li>
				</ul>
			</div>

			<div class="message-list-item-details-chat" v-if="loadingThreads" >
				<fc-spinner size="huge" :message="t('Loading...')"></fc-spinner>
			</div>

			<div v-else class="message-list-item-details-chat">
				<fc-messages
					:style="{
						height: '425px',
						overflowY: 'scroll'
					}"
					:messages="messages"
					:me="me"
				/>
				<div class="message-list-item-details-chat-form" :style="`opacity: ${notFriend(topic.topic.type, threads) ? '50%' : '100%'};`">
					<form ref="messageForm" @submit.prevent="handleSubmit">
						<div class="row" style="width: 100%;">
							<div class="columns small-10">
                <label hidden for="messageBody">Message</label>
								<input :disabled="!chatEnabled"
                       id="messageBody"
                       type="text"
                       ref="messageBody"
                       :placeholder="(chatEnabled) ? t('Write a Message (1000 characters max)') : chatDisabledMessage"
                       maxlength="998"
                       name="messageBody"
                       required
                >
							</div>
							<div class="columns small-2">
								<fc-spinner v-if="sendingMessage" size="medium" :message="t('Sending...')"></fc-spinner>
								<button v-else
                        :class="(chatEnabled) ? 'btn-default' : 'btn-default fc-disabled'"
                        :disabled="!chatEnabled"
                >{{ t('Send') }}</button>
							</div>
						</div>
					</form>
				</div>
      </div>
    </div>
	</div>
</template>

<script>
	import { topicTitle, postGroup } from './helpers';

	// TODO: for friend thread with someone no longer a friend, we can disable the input form with:  $(".message-list-item-details-chat-form :input").attr("disabled", "disabled");
	// TODO: also need to put some message placeholder in the disabled form "no longer a friend"
	// TODO: so test for topic.topic.type == 'friend' and if the other user ISNT a friend
	// friends will always be in this.$root.globalData.friends
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
				chatEnabled: true,
        chatDisabledMessage: '',
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
			this.isChatClosed()
    },
		methods: {
		  isChatClosed() {
		    const topic = this.$options.propsData.topic.topic
        const threads = this.$options.propsData.threads
		    if(this.isTakenOrReceived()) {
		      this.chatEnabled = false
          this.chatDisabledMessage = this.t('This post is taken or received')
        } else if(this.notFriend(topic.type, threads)) {
          this.chatEnabled = false
          this.chatDisabledMessage = this.t('No longer a friend.')
        } else if(!topic.post.is_open) {
          this.chatEnabled = false
          this.chatDisabledMessage = this.t('This post has been cancelled')
        } else {
		      this.chatEnabled = true
          this.chatDisabledMessage = ''
        }
      },
			color: (id) => colors[id % colors.length],
			title: topicTitle,
			group: postGroup,
			handleSubmit() {
				let self = this;
				self.sendingMessage = true;

				const body = this.$refs.messageBody.value;
				const form = this.$refs.messageForm;

				return this.onSubmitMessage(body)
				.then(() => {
					form.reset();
					self.sendingMessage = false;
				})
        .catch(e => {
          console.log('e in MessagesBoard', e)
          switch (e.status) {
            case 404:
              return this.$bus.$emit('alert', { level : 'alert', message: t("That post does not exist"), timer: 10000 });
            case 409:
              return this.$bus.$emit('alert', { level : 'alert', message: e.responseJSON.message, timer: 10000 });
            default:
              return this.$bus.$emit('alert', { level: 'alert', message: t('Unable to reply on this post'), timer: 10000 })
          }
        })
			},
      isTakenOrReceived() {
        // Being extra careful here to make sure we don't hit any undefineds
        if (!this.$options.propsData.hasOwnProperty('topic')) return false
        const topic = this.$options.propsData.topic
        if (!topic.hasOwnProperty('topic') || !topic.topic.hasOwnProperty('post') || !topic.topic.post.hasOwnProperty('type')) return false
        const postType = topic.topic.post.type
        return postType.const === 'FC_POST_TAKEN' || postType.const === 'FC_POST_RECEIVED'
      },
			notFriend: (type, threads) => {

				const userId = (threads[0] && threads[0].user && threads[0].user.id) ? threads[0].user.id : 0;
				return !!((type === 'friend') && !window.vm.$root.globalData.friends.includes(userId));
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
