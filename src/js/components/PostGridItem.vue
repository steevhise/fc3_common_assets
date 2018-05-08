<template>
	<div class="row">
		<div class="post-grid-item" style="padding: 5px;" >
			<div class="post-grid-item-inner">
				<div class="post-grid-item-header">
					<div class="post-grid-item-header-left">
						<div class="post-grid-item-category-icon">
							<fc-icon name="chevron" :classname="`icon-chevron-${postType}`"></fc-icon>
							<span :class="`text-${postType}`">{{postType}}</span>
						</div>
					</div>
					<div class="post-grid-item-header-right">
						<div class="post-grid-item-header-icon" v-if="post.group">
							<span>{{post.group.name}}</span>
							<fc-icon name="map_pin"></fc-icon>
							<span>{{post.location }}</span>
						</div>
					</div>

				</div>
				<div class="post-grid-item-photo">
					<img style="width: 100%; height: auto;" :src="post.image" v-if="post.image">
					<fc-icon name="logo" v-else></fc-icon>
				</div>
				<div class="post-grid-item-content">
					<a :href="path.posts_detail + post.id">
						<h4 v-html="post.subject"></h4>
					</a>
				</div>
				<div class="post-grid-item-footer">
					<div class="post-grid-item-header-left">
						<span class="text-lighten">{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : undefined)) }}</span>
					</div>
					<div class="post-grid-item-header-right">
						<select class="manage-post-select" v-if="viewer === post.userId && post.isApproved" :class="`btn-${postType}`" v-on:change="manageOp">
							<option value="" disabled selected hidden>Manage Post</option>
							<option value="edit">Edit</option>
							<option value="delete">Delete</option>
						</select>
						<p v-else-if="viewer === post.userId && !post.isApproved" class="callout alert">In Moderation</p>
						<button v-else :class="`btn-${postType}`">Reply</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-post-grid-item',
		props: ['item', 'path', 'index', 'viewer'],
		data() {
			return {
				post: this.item
			}
		},
		computed: {
			postType() {
				return this.post.type.name.toLowerCase();
			}
		},
		methods: {
			manageOp: function (event) {

				const instance = this;
				const operation = event.currentTarget.value;

				switch (operation) {
					case 'edit':
						const { protocol, host } = window.location;
						const url = `${protocol}//${host}${instance.path.home_post_edit}${instance.post.id}`;
						window.location.assign(url);
						break;
					case 'delete':
						window.$.ajax({
							method: 'DELETE',
							url: `/api/posts/${instance.post.id}`
						})
						.done((data, status) => {
							instance.$emit('remove');
						})
						.fail(() => {
							const errorBlock = document.createElement('p');
							const errormsg = document.createTextNode('We couldn\'t delete your post at this time. Sorry!');
							const error = window.$(errorBlock).append(errormsg).addClass('callout alert');
							window.$(`.post-grid-item:eq(${instance.index})`).find('.post-grid-item-content').prepend(error);
						});
						break;
				}
			}
		}
	}
</script>
