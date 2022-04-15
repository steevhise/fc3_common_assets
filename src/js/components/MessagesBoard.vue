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
            @click="localThreadClicked(thread.id)">
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
								<textarea rows="2" :disabled="!chatEnabled"
                       id="messageBody"
                       type="text"
                       ref="messageBody"
                       :placeholder="(chatEnabled) ? t('Write a Message (1000 characters max)') : chatDisabledMessage"
                       maxlength="998"
                       name="messageBody"
                       required
                ></textarea>
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
  import moment from 'moment';

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
				this.isChatClosed();
      });
    },
		methods: {
      isChatClosed() {
        const topic = this.$options.propsData.topic.topic
        const threads = this.$options.propsData.threads  // these are non-reactive now, i think. so don't do this.
        if(this.isTakenOrReceived()) {  // and is too old
          this.chatEnabled = false
          this.chatDisabledMessage = this.t('This post was taken or received too long ago to permit replies.')
        } else if(this.notFriend(this.$options.propsData.type, this.$options.propsData.threads)) {
          this.chatEnabled = false
          this.chatDisabledMessage = this.t('No longer a friend.')
        } else if(topic.post && !topic.post.is_open) {
          this.chatEnabled = false
          this.chatDisabledMessage = this.t('This post has been cancelled')
        } else if(topic.type === 'group' && !this.$root.globalData.towns.find((town) => town.id === topic.group.id)) {
          this.chatEnabled = false
          this.chatDisabledMessage = this.t('You are no loner a member of this group')
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
          switch (e.status) {
            case 404:
              return this.$bus.$emit('alert', { level : 'alert', message: this.t("That post does not exist"), timer: 8000 });
            case 409:
              return this.$bus.$emit('alert', { level : 'alert', message: e.responseJSON.message, timer: 10000 });
            case 500:
              return this.$bus.$emit('alert', { level : 'alert', message: e.responseJSON.message, timer: 10000 });
            default:
              return this.$bus.$emit('alert', { level: 'alert', message: this.t('Unable to reply on this post'), timer: 8000 })
          }
        })
        .finally(() => {
          self.sendingMessage = false;
        })
			},
      isTakenOrReceived: function () {
        // Being extra careful here to make sure we don't hit any undefineds
        if (!this.$options.propsData.hasOwnProperty('topic')) {
          console.debug('no topic');
          return false;
        }
        const topic = this.$options.propsData.topic;   // makes it non-reactive?
        if (!topic.hasOwnProperty('topic') || !topic.topic.hasOwnProperty('post') || !topic.topic.post.hasOwnProperty('type')) {
          return false;
        }
        const now = moment().utc();
        // const postDate = moment(this.$options.propsData.topic.topic.post.post_date).utc();
        // allow messaging on posts marked taken/received in the last 7 days
        console.debug(now.diff(moment(this.$options.propsData.topic.topic.post.post_date).utc(), 'days'), 'days');
        const tooOld = now.diff(moment(this.$options.propsData.topic.topic.post.post_date).utc(), 'days') > 7;
        // const postType = topic.topic.post.type;
        return tooOld && (this.$options.propsData.topic.topic.post.type.const === 'FC_POST_TAKEN' || this.$options.propsData.topic.topic.post.type.const === 'FC_POST_RECEIVED');
      },
      localThreadClicked(threadId) {
        this.isChatClosed()
        this.onClickThread(threadId)
      },
			notFriend: (type, threads) => {

				const userId = (threads[0] && threads[0].user && threads[0].user.id) ? threads[0].user.id : 0;
				return !!((type === 'friend') && !window.vm.$root.globalData.friends.includes(userId));
			}
		},
    mounted() {
      moment.locale(window.language);    // language set in top-level... apparently we can't use this.i18nOptions.lng here?
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
<style lang="scss">
@import '../../scss/_settings';
  input#messageBody::placeholder {color: $black;}
  </style>
