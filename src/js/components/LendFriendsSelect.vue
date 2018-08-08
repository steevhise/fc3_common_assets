<template>
	<fc-modal custom-target="friend-select-form">
		<fc-spinner v-if="!friendsLoaded" size="huge" message="Loading..." ></fc-spinner>
		<div v-else id="friend-select-body">
			<h2>{{ post.subject }}</h2>
			<h3>Which friend are you lending to?</h3>
			<p>They will be notified of how long they can keep the item and if/when it's overdue.</p>
			<div v-if="post">
				<fc-form :action="`/api/posts/${post.id}/lend`" :custom-alert-el="_uid" >
					<select name="borrower">
						<option v-for="friend in friends"
							:key="friend.id"
							:value="friend.id"
							:label="`${friend.username} ${friend.firstName && friend.lastName && `(${friend.firstName} ${friend.lastName})`}`"
						/>
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
		created() {
			this.$bus.$on('friend-select:trigger', ({ post }) => {

				this.post = post;
			});

			this.$bus.$on(`formSuccess-${this._uid}`, (share) => {

				console.log('WE GET HERE!!!', share);
				this.$emit('friend-selected', { share, post: this.post });
			});

			const self = this;

			$.get(`/api/friends`)
			.done((data, status) => {
				self.friends = data.friends;
				self.friendsLoaded = true;
			})
			.fail(() => {
				self.friendsLoaded = true;
				$('#friend-select-body').html('<p class="callout alert">Failed to load your friends list. Contact your local moderator for help. Sorry for the inconvenience!</p>');
			});
		}
	}
</script>
