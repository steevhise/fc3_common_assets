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
						<!-- Service layer guarantees posts awaiting approval are returned ONLY for owning user -->
						<p v-if="!post.isApproved" class="callout alert">Awaiting Approval</p>
						<template v-else-if="viewer === post.userId">
							<template v-if="postType === 'LEND'">
								<div v-if="!lent"  data-open="friend-select-form"
									style="display: none;"
									v-on:click="onClickModalTrigger"
									:id="`friend-select-trigger-${post.id}`"
								/>
								<p v-else-if="overdue" class="callout warning">
									Item Overdue!<span v-if="due"> It was due on {{ due }}.</span>
									<a :href="`/home/my-replies?type=post&id=${post.id}`">Message your friend</a>
								</p>
								<p v-else-if="lent" class="callout success">On Loan!<span v-if="due"> Due back on {{ due }}</span></p>
							</template>
							<select class="manage-post-select post-grid-select" :class="`btn-${lowercase(postType)}`" v-on:change="manageOp">
								<option value="" disabled selected hidden>Manage Post</option>
								<option value="edit">Edit Post</option>
								<option v-if="closedType" value="mark" >Mark As {{ `${closedType[0]}${lowercase(closedType.slice(1))}` }}</option>
								<option v-else-if="postType === 'LEND'" :value="lent ? 'return' : 'lend'">
									<span v-if="lent">Item Returned</span><span v-else>Lend Item</span>
								</option>
								<option value="delete">Delete Post</option>
								<option value="replies">See Replies</option>
							</select>
						</template>
						<template v-else-if="lent && viewer === post.share.borrowerId">
							<p v-if="overdue" class="callout warning">Item Overdue!<span v-if="due"> It was due on {{ due }}</span></p>
							<p v-else class="callout success">BORROWING!<span v-if="due"> Due back on {{ due }}</span></p>
						</template>
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
