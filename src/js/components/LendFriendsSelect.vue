<template>
	<fc-modal id="friend-select-modal" custom-target="friend-select-form" data-options="v-offset: auto">
		<fc-spinner v-if="!friendsLoaded" size="huge" :message="t('Loading...')" ></fc-spinner>
		<div v-else id="friend-select-body">
			<h2>{{ post.subject }}</h2>
			<h3>{{ t('Which friend are you lending to?') }}</h3>
			<p>{{ t("They will be notified of how long they can keep the item and if/when it's overdue.") }}</p>
			<div v-if="post">
				<fc-form :action="`/api/posts/${post.id}/lend`" :custom-alert-el="_uid" >
					<select name="borrower">
						<option v-for="friend in friends"
							:key="friend.id"
							:value="friend.id"
						>{{ friend.username }}<span v-if="friend.firstName && friend.lastName"> ({{ friend.firstName }} {{ friend.lastName }})</span>
						</option>
					</select>
					<!-- For some reason, using a button element triggers submit twice, but input doesn't -->
					<input class="btn btn-default" type="submit" value="Lend to Friend!">
				</fc-form>
			</div>
		</div>
	</fc-modal>
</template>

<script>

	export default {
		name: 'fc-lend-friends-select',
		props: {},
		data() {
			return {
				post: {
					type: Object,
					default: () => null
				},
				friends: {
					type: Array,
					default: null
				},
				friendsLoaded: false
			};
		},
		mounted() {
			$('#friend-select-modal').foundation();   // initialize foundation on this element, so we can be ready to open the modal
		},
		created() {

			this.$bus.$on('friend-select:trigger', ({ post }) => {

				this.post = post;
			});

			this.$bus.$on(`formSuccess-${this._uid}`, ({share, threadId }) => {

				this.$emit('friend-selected', { share, post: this.post, threadId });
			});

			const self = this;

			$.get(`/api/friends`)
			.done((data, status) => {
				self.friends = data.friends;
				self.friendsLoaded = true;
			})
			.fail(() => {
				console.debug('friends list fail');
				self.friendsLoaded = true;
				$('#friend-select-body').html('<p class="callout alert">Failed to load your friends list. Contact your local moderator for help. Sorry for the inconvenience!</p>');
			});
		}
	}
</script>
