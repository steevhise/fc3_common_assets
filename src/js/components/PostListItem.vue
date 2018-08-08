<template>
	<div class="post-list-item" >
		<div class="post-list-item-photo">
			<img width="128" :src="post.thumb" v-if="post.thumb">
			<fc-icon name="logo" width="128" v-else></fc-icon>
		</div>
		<div class="post-list-item-content">
			<div class="post-list-item-content-header">
				<div class="post-list-item-header-left">
					<div class="post-list-item-category-icon">
						<fc-icon name="chevron" :classname="`icon-chevron-${lowercase(postType)}`"></fc-icon>
						<span :class="`text-${lowercase(postType)}`">{{lowercase(postType)}}</span>
					</div>
					<div class="post-list-item-header-icon" v-if="post.group">
						<fc-icon name="map_pin"></fc-icon>
						<span>{{ post.group.name }}</span>
					</div>
				</div>
				<div v-if="viewer" class="post-list-item-header-right">
					<span class="text-lighten">{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : undefined)) }}</span>
					<select v-if="viewer === post.userId && post.isApproved" class="manage-post-select post-list-select" :class="`btn-${lowercase(postType)}`" v-on:change="manageOp">
						<option value="" disabled selected hidden>Manage Post</option>
						<option value="edit">Edit Post</option>
						<option v-if="closedType" value="mark" >Mark As {{ `${closedType[0]}${lowercase(closedType.slice(1))}` }}</option>
						<option value="delete">Delete Post</option>
						<option value="replies">See Replies</option>
					</select>
					<p v-else-if="viewer === post.userId && !post.isApproved" class="callout alert">Awaiting Approval</p>
					<fc-messages-detail-input v-else-if="['OFFER', 'WANTED', 'LEND', 'BORROW'].includes(postType)" topic-type="post" :topic-id="post.id" :custom-trigger="replyButton">
					  <p><strong>New Message Re:</strong> {{ post.subject }}</p>
					</fc-messages-detail-input>
				</div>
			</div>
			<div class="post-list-item-content-description">
				<h4><a :href="path.posts_detail + post.id">{{ post.subject }}</a></h4>
				<p> {{post.description | stripTags | truncate(120)}}</p>
			</div>
		</div>
	</div>
</template>

<script>

	import { postItemConfig } from './helpers';

	export default {
		name: 'fc-post-list-item',
		...postItemConfig
	}
</script>
