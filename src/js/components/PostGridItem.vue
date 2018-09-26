<template>
	<div class="post-grid-item" style="padding: 5px;" v-bind="$attrs" >
		<div class="post-grid-item-inner">
			<div class="post-grid-item-header">
				<div class="post-grid-item-header-left">
					<div class="post-grid-item-category-icon">
						<fc-icon name="chevron" :classname="`icon-chevron-${lowercase(postType)}`"></fc-icon>
						<span :class="`text-${lowercase(postType)}`">{{lowercase(postType)}}</span>
					</div>
					<div v-if="post.static && post.static.lendDuration" style="margin: 0 2rem">
						<strong>Lend Duration: </strong>{{ post.static.lendDuration }} days
					</div>
				</div>
				<div class="post-grid-item-header-right">
					<div class="post-grid-item-header-icon" v-if="post.group">
						<i class="fa fa-city"></i>
						<span :alt="post.group.name" :title="post.group.name">{{post.group.name|truncate(13)}}</span>
					</div>
				</div>
			</div>
			
			<div class="post-grid-item-photo">
				<div v-if="post.image" :style="`width: 100%; height: 200px; background-size: cover; background-position: center center; background-repeat: no-repeat; background-image: url(${post.image});`"></div>
			</div>
			<hr/>
			<div class="post-grid-item-content">
				<a :href="path.posts_detail + post.id" :alt="post.subject" :title="post.subject" >
					<h4 style="font-size: 20px; border: none;" >{{post.subject|truncate(25)}}</h4>
				</a>
			</div>
			<div class="post-grid-item-addinfo row is-hidden">
				<ul class="accordion" data-accordion data-allow-all-closed="true" data-deep-link="false" data-update-history="false" data-deep-link-smudge="false">
					<li class="accordion-item" data-accordion-item>
						<a class="accordion-title" style="text-align: center; font-size: 16px; color: #34b233;">Details</a>
						<div class="accordion-content" data-tab-content>
							<div class="row" style="font-size:12px;">
								Crossroads: <span><i class="fa fa-map-signs"></i> {{post.location }}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<hr/>
			<div class="row" style="text-align: center;" >
				<div class="post-grid-item-header-left">
					<span class="text-lighten">{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : undefined)) }}</span>
				</div>
				<div v-if="viewer" class="post-grid-item-header-right">
					<!-- Service layer guarantees posts awaiting approval are returned ONLY for owning user -->
					<button style="border-radius: 0px; border: solid 2px #d4cfc7; background-color: #34b233; cursor: default;" class="btn" v-if="!post.isApproved">Awaiting Approval</button>
					<template v-else-if="viewer === post.userId">
						<template v-if="postType === 'LEND'">
							<div v-if="!lent"  data-open="friend-select-form"
								style="display: none;"
								v-on:click="onClickModalTrigger"
								:id="`friend-select-trigger-${post.id}`"
							></div>
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
						<p v-if="overdue" class="callout warning">
							Item Overdue!<span v-if="due"> It was due on {{ due }}</span>
							<a :href="`/home/my-replies?type=post&id=${post.id}`">Let your friend know what's up</a>
						</p>
						<p v-else class="callout success">BORROWING!<span v-if="due"> Due back on {{ due }}</span></p>
					</template>
					<fc-messages-detail-input v-else-if="((route.id === 'groups_main' && isMember ) || !['groups_main','search_posts'].includes(route.id) && ['OFFER', 'WANTED', 'LEND', 'BORROW'].includes(postType))" topic-type="post" :topic-id="post.id" :custom-trigger="replyButton">
						<p><strong>New Message Re:</strong> {{ post.subject }}</p>
					</fc-messages-detail-input>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	import { postItemConfig } from './helpers';

	export default {
		name: 'fc-post-grid-item',
		...postItemConfig,
		mounted() {
			// this.$root.$emit('initAccordions', '.accordion');
		}
	}
</script>
