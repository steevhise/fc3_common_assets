<template>
	<div style="visibility: hidden;" v-if="blockedUsers.length && blockedUsers.includes(post.userId)" v-once>
        <!--post by user:{{post.userId}} blocked cuz in: {{blockedUsers|json}}-->
    </div>
    <div class="post-list-item" v-else >
    	<div class="upper-row">
			<div class="post-list-item-category-icon">
				<fc-icon name="chevron" :classname="`icon-chevron-${lowercase(postType)}`"></fc-icon>
				<span :class="`text-${lowercase(postType)}`">{{lowercase(t(postType))}}</span>
			</div>
			<!-- chooser -->
				<div v-if="viewer" class="post-list-item-header-right">
					<template v-if="viewer === post.userId">
					<!-- Service layer guarantees pending posts are returned ONLY for owning user but this still needs to be here inside above conditional-->
						<button v-if="post.isApproved == false" style="border-radius: 0px; border: solid 2px #d4cfc7; background-color: #34b233; cursor: default;" class="btn" >{{ t('Awaiting Approval') }}</button>
						<template v-if="postType === 'LEND'">
							<div v-if="!lent"  data-open="friend-select-form"
								style="display: none;"
								v-on:click="onClickModalTrigger"
								:id="`friend-select-trigger-${post.id}`"
							></div>
							<p v-else-if="overdue" class="callout warning">
								{{ t('Item Overdue!') }}<span v-if="due"> {{ t('It was due on') }} {{ due }}.</span>
								<a :href="`/home/my-replies?type=post&id=${post.id}`">{{ t('Message your friend') }}</a>
							</p>
							<p v-else-if="lent" class="callout success">{{ t('On Loan!') }}<span v-if="due"> {{ t('Due back on') }} {{ due }}</span></p>
						</template>
						<span class="post-list-item-date text-lighten">
							{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : timezone )) }}
						</span>
						<!--  if pending post, show "manage" button, but only with delete.? -->
						<select class="manage-post-select post-list-select" :class="`btn-${lowercase(postType)}`" v-on:change="manageOp">
							<option value="" disabled selected hidden>{{ t('Manage Post') }}</option>
							<option v-if="post.isApproved == true" value="edit">{{ t('Edit Post') }}</option>
							<option v-if="(post.isApproved == true) && closedType" value="mark" >{{ t('Mark As') }} {{ t(`${closedType[0]}${lowercase(closedType.slice(1))}`) }}</option>
							<option v-else-if="postType === 'LEND'" :value="lent ? t('return') : t('lend')">
								<span v-if="lent">{{ t('Item Returned') }}</span><span v-else>{{ t('Lend Item') }}</span>
							</option>
							<option value="delete">{{ t('Delete Post') }}</option>
							<option v-if="post.isApproved == true" value="replies">{{ t('See Replies') }}</option>
						</select>
					</template>
					<template v-else-if="lent && viewer === post.share.borrowerId">
						<p v-if="overdue" class="callout warning">
							{{ t('Item Overdue!') }}<span v-if="due"> {{ t('It was due on') }} {{ due }}</span>
							<a :href="`/home/my-replies?type=post&id=${post.id}`">{{ t("Let your friend know what's up") }}</a>
						</p>
						<p v-else class="callout success">{{ t('BORROWING!') }}<span v-if="due"> {{ t('Due back on') }} {{ due }}</span></p>
						<span class="post-list-item-date text-lighten">
							{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : timezone )) }}
						</span>
					</template>
					<template v-else-if="((route.id === 'groups_main' && isMember ) || !['groups_main','search_posts'].includes(route.id) && ['OFFER', 'WANTED', 'LEND', 'BORROW'].includes(postType))">
						<span class="post-list-item-date text-lighten">
								{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : timezone )) }}
						</span>
						<fc-messages-detail-input  topic-type="post" :topic-id="post.id" :custom-trigger="replyButton">
						  <p><strong>{{ t('New Message Re:') }}</strong> {{ post.subject | stripTags }}</p>
						</fc-messages-detail-input>
					</template>
				</div>
			<div v-else class="post-list-item-header-right">
				<span class="post-list-item-date text-lighten">
							{{ post.date | mreldate(post.time, (post.group ? post.group.timezone : timezone )) }} <!-- this still needs to be here even if not logged in -->
				</span>
			</div>
			<!-- chooser -->
		</div>
		<div class="post-list-item-photo" v-if="post.thumb" v-lazy-container="{ selector: 'img' }" >
			<img :data-src="post.thumb">
			<!-- <div v-else class="post-image-placeholder" >
				<fc-icon name="chevron" :classname="`icon-chevron-${lowercase(postType)}`" style="position: absolute; width:100%; height: 100%; left: 60px; top:50px;" ></fc-icon>
			</div> -->
		</div>
		<div class="post-list-item-content">
			<div class="post-list-item-content-header">
				<div class="post-list-item-header-left">
					<div class="post-list-item-content-description hide-for-medium hide-for-large">
						<h4><a :href="path.posts_detail + post.id">{{ post.subject }}</a></h4>
						<p> {{post.description | stripTags | truncate(120)}}</p>
					</div>
					<div class="post-list-item-header-icon group-icon" v-if="post.group">
						<fc-icon name="map_pin"></fc-icon>
						<span>{{ post.group.name }}</span>
					</div>
					<div v-if="post.static && post.static.lendDuration" class="lend-duration">
						<strong>{{ t('Lend Duration:') }} </strong>{{ post.static.lendDuration }} {{ t('days') }}
					</div>
                    <div class="post-list-item-header-icon location-icon" v-if="post.location">
                        <fc-icon name="location"></fc-icon>
                        <span>{{ post.location }}</span>
                    </div>
				</div>
			</div>
			<div class="post-list-item-content-description hide-for-small-only">
				<h4><a :href="path.posts_detail + post.id">{{ post.subject | stripTags }}</a></h4>
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
