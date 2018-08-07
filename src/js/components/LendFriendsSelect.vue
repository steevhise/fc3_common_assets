<template>
	<div >
		<div class="friend-select-trigger" :data-open="getTarget" v-on:click="onClickModalTrigger()" style="display: none;"></div>
		<div class="reveal" :id="getTarget" data-reveal>
			<fc-spinner v-if="!topicsLoaded" size="huge" message="Loading..." ></fc-spinner>
			<div v-else id="friend-select-body">
				<h3>Which friend are you lending to?</h3>
				<p>Select the friend you're lending your item, so they're notified of how long they can keep the item and if/when it's overdue.</p>
				<fc-form :action="`/api/posts/${postId}/lend`" :custom-alert="true" >
					<select name="borrower">
						<option v-for="friend in friends"
							:key="friend.id"
							:value="friend.id"
							:label="`${friend.username} (${friend.firstName} ${friend.lastName})`"
						/>
					</select>
					<!-- For some reason, using a button element triggers submit twice, but input doesn't -->
					<input class="btn btn-default" type="submit" value="Send">
				</fc-form>
			</div>
			<button data-close type="button" style="display: none;" >Close</button>
		</div>
	</div>
</template>

<script>

	export default {
		name: 'fc-friend-select',
		props: {
			postId: Number
		},
		data() {
			return {
				reveal: {
					type: Object,
					default: () => {}
				},
				friends: {
					type: Array,
					default: null
				},
				loadingFriends: false
			};
		},
		created() {
			this.$bus.$on('formSuccess', (data) => {

				const { share } = data;
				this.$bus.$emit('friend-selected', share);
			});

			// For modals that contain forms that submit via AJAX and handle responses with Callout component
			// Prevents callouts from being obscured by modal background overlay
			this.$bus.$on('alert', (data) => {

				// Easier logic for elements manually instantied (see mounted() )
				if (this.reveal.close) {
					return this.reveal.close();
				}

				// Reference to actual Foundation Reveal modal element
				const fReveal = $(`#${this.getTarget}`);

				// If modal is open
				if (fReveal.attr('aria-hidden') === 'false' && data.level === 'success') {
					// Unfortunate workaround for the fact that foundation's close method appears to be unavailable
					// in our project (guessing a missing library (modal requires motion-ui))
					fReveal.find('button').trigger('click');
				}
			});

			const self = this;
			this.loadingFriends = true;
			$.get(`/api/friends`)
			.done((data, status) => {
				console.log('API CALL WORKED!', data.friends);
				self.friends = data.friends;
				self.loadingFriends = false;
			})
			.fail(() => {
				$('#friend-select-body').html('<p class="callout alert">Failed to load your friends list. Contact your local moderator for help. Sorry for the inconvenience!</p>');
			});
		},
		mounted() {

			/**
				Sorry this is extra funky :(

				Handles the cases where this component may be displayed within a list view, but
				not immediately visible e.g. a post in a post list beyond the first 10 posts, revealed
				on the user clicking "Load More". It looks like on page load, Foundation's Reveal module finds all
				elements marked up as it expects and turns those into modals (see https://foundation.zurb.com/sites/docs/reveal.html).
				This routine picks up only those elements that are actually part of the DOM at runtime i.e. not our
				unloaded list items. So, we manually instantiate Reveal modals using elements as loaded

				For elements already in the DOM, Foundation hasn't been loaded into the current window yet, so the below
				instantiation would fail. Fortunately, we can safely fallback to Foundation's load routine in those cases
			**/
			if (window.Foundation) {
				this.reveal = new Foundation.Reveal($(`#${this.getTarget}`));
			}
		},
		computed: {
			getTarget() {
				return `friend-select-form-${this.postId}`;
			}
		},
		methods: {
			onClickModalTrigger() {

				if (this.reveal.open) {
					return this.reveal.open();
				}

				// Automatically instantiated modals (see note in mounted() )
				// use Foundation's methods automatically
				return;
			}
		}
	}

	/**
	- Load user's friends
	- Display in a dropdown
	**/
</script>
