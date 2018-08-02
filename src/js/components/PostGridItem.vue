<template>
	<div class="row">
		<div class="post-grid-item" style="padding: 5px;" >
			<div class="post-grid-item-inner">
				<div class="post-grid-item-header">
					<div class="post-grid-item-header-left">
						<div class="post-grid-item-category-icon">
							<fc-icon name="chevron" :classname="`icon-chevron-${lowercase(postType)}`"></fc-icon>
							<span :class="`text-${lowercase(postType)}`">{{lowercase(postType)}}</span>
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
					<div v-if="viewer" class="post-grid-item-header-right">
						<select v-if="viewer === post.userId && post.isApproved" class="manage-post-select post-grid-select" :class="`btn-${lowercase(postType)}`" v-on:change="manageOp">
							<option value="" disabled selected hidden>Manage Post</option>
							<option value="edit">Edit</option>
							<option v-if="closedType" value="mark" >Mark As {{ `${closedType[0]}${lowercase(closedType.slice(1))}` }}</option>
							<option value="delete">Delete</option>
							<option value="replies">See Replies</option>
						</select>
						<p v-else-if="viewer === post.userId && !post.isApproved" class="callout alert">In Moderation</p>
						<fc-messages-detail-input v-else-if="['OFFER', 'WANTED', 'LEND', 'BORROW'].includes(postType)" topic-type="post" :topic-id="post.id" :custom-trigger="replyButton">
				          <p><strong>New Message Re:</strong> {{ post.subject }}</p>
				      	</fc-messages-detail-input>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	import { postItemConfig } from './helpers';

	export default {
		name: 'fc-post-grid-item',
		...postItemConfig
	}
</script>
