<template>
	<div class="post-list-item" >
		<div class="post-list-item-photo">
			<img :src="post.thumb" v-if="post.thumb">
			<fc-icon name="logo" width="128" v-else></fc-icon>
		</div>
		<div class="post-list-item-content">
			<div class="post-list-item-content-header">
				<div class="post-list-item-header-left">
					<div class="post-list-item-category-icon">
						<fc-icon name="chevron" :classname="`icon-chevron-${postType}`"></fc-icon>
						<span :class="`text-${postType}`">{{postType}}</span>
					</div>
					<div class="post-list-item-header-icon" v-if="post.group">
						<fc-icon name="map_pin"></fc-icon>
						<span>{{ post.group.name }}</span>
					</div>
				</div>
				<div v-if="viewer" class="post-list-item-header-right">
					<span class="text-lighten">{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : undefined)) }}</span>
					<select class="manage-post-select" v-if="viewer === post.userId && post.isApproved" :class="`btn-${postType}`" v-on:change="manageOp">
						<option value="" disabled selected hidden>Manage Post</option>
						<option value="edit">Edit Post</option>
						<option value="delete">Delete Post</option>
						<option value="replies">See Replies</option>
					</select>
					<p v-else-if="viewer === post.userId && !post.isApproved" class="callout alert">In Moderation</p>
					<fc-messages-detail-input v-else topic-type="post" :topic-id="post.id" :custom-trigger=replyButton >
					  <p><strong>New Message Re:</strong> {{ post.subject }}</p>
					</fc-messages-detail-input>
				</div>
			</div>
			<div class="post-list-item-content-description">
				<h4><a :href="path.posts_detail + post.id">{{ post.subject }}</a></h4>
				<p class="paragraph-small" v-html="post.description"></p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-post-list-item',
		props: ['item', 'path', 'index', 'viewer'],
		data() {
			return {
				post: this.item
			}
		},
		computed: {
			postType() {
				return this.post.type.name.toLowerCase();
			},
			replyButton() {
				return `<button class="btn-${this.postType}">Reply</button>`;
			}
		},
		methods: {
			manageOp: function (event) {

				const instance = this;
				const operation = event.currentTarget.value;
				const { protocol, host } = window.location;

				switch (operation) {
					case 'edit':
						const url = `${protocol}//${host}${instance.path.home_post_edit}${instance.post.id}`;
						window.location.assign(url);
						break;
					case 'delete':
						window.$.ajax({
							method: 'DELETE',
							url: `/api/posts/${instance.post.id}`
						})
						.done(() => {
							instance.$emit('post-deleted');
						})
						.fail(() => {
							const errorBlock = document.createElement('p');
							const errormsg = document.createTextNode('We couldn\'t delete your post at this time. Sorry!');
							const error = window.$(errorBlock).append(errormsg).addClass('callout alert');
							window.$(`.post-list-item:eq(${instance.index})`).find('.post-list-item-content').prepend(error);
						});
					case 'replies':
						const { protocol, host } = window.location;
						const myReplies = `${protocol}//${host}/home/my-replies?type=post&id=${this.post.id}`;
						window.location.assign(myReplies);
						break;
				}
			}
		}
	}
</script>
