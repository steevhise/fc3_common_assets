<template>
	<div style="visibility: hidden;" v-if="blockedUsers.length && blockedUsers.includes(post.userId)" v-once>
		<!--post by user:{{post.userId}} blocked cuz in: {{blockedUsers|json}}-->
	</div>
	<div class="post-grid-item" :data-id="post.id" v-else style="padding: 5px;" v-bind="$attrs" >
		<div class="post-grid-item-inner">
			<div class="post-grid-item-header">
				<div class="post-grid-item-header-left">
					<div class="post-grid-item-category-icon">
						<fc-icon name="chevron" :classname="`icon-chevron-${lowercase(postType)}`"></fc-icon>
						<span :class="`text-${lowercase(postType)}`">{{ lowercase(t(postType)) }}</span>
					</div>
					<div v-if="post.static && post.static.lendDuration" style="margin: 0 2rem">
						<strong>{{ t('Lend Duration') }}:</strong> {{ post.static.lendDuration }} {{ t('days') }}
					</div>
				</div>
				<div class="post-grid-item-header-right">
					<div class="post-grid-item-header-icon" v-if="post.group">
						<i class="fa fa-city">
							<fc-icon name="map_pin"></fc-icon>
						</i>
						<span :alt="post.group.name" :title="post.group.name"><a :href="`/town/${post.group.uniqueName}`">{{post.group.name|truncate(16)}}</a></span>
					</div>
					<div class="post-grid-item-header-icon" v-else>
						<i class="fa fa-city">
						<fc-icon name="friend_circle"></fc-icon>
						</i>
						<span :alt="t('Friends Circle')" :title="t('Friends Circle')">{{ t('Friends Circle') }}</span>
					</div>
				</div>
			</div>

			<div class="post-grid-item-photo">
				<div v-if="post.image" v-lazy:background-image="post.image" :style="`width: 100%; height: 200px; background-size: cover; background-position: center center; background-repeat: no-repeat;`"></div>
			</div>
			<hr/>
			<div class="post-grid-item-content">
				<h4 style="font-size: 20px; border: none;" >
					<a :href="path.posts_detail + post.id" :alt="post.subject" :title="post.subject" >
						{{post.subject|truncate(25)}}
					</a>
				</h4>
			</div>
			<div class="post-grid-item-addinfo row is-hidden">
				<ul class="accordion" data-accordion data-allow-all-closed="true" data-deep-link="false" data-update-history="false" data-deep-link-smudge="false">
					<li class="accordion-item" data-accordion-item>
						<a class="accordion-title" style="text-align: center; font-size: 16px; color: #34b233;">{{ t('Details') }}</a>
						<div class="accordion-content" data-tab-content>
							<div class="row" style="font-size:12px;">
								{{ t('Crossroads') }}: <span><i class="fa fa-map-signs"></i> {{ post.location }}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<hr/>
			<div class="row" style="text-align: center;" >
				<div class="post-grid-item-header-left">
					<span class="text-lighten-less">{{ post.date | mreldate(post.time, (post.group && post.group.timezone ? post.group.timezone : timezone )) }}</span>
				</div>
				<div v-if="viewer" class="post-grid-item-header-right">
					<template v-if="viewer === post.userId">
            <!-- Service layer guarantees posts awaiting approval are returned ONLY for owning user -->
            <button style="pointer-events: none; cursor: default;" class="btn btn-default" v-if="!post.isApproved && post.isApproved !== undefined">{{ t('Awaiting Approval') }}</button>
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
						<select v-if="currentRoute.split('/')[1] !== 'member'" class="manage-post-select post-list-select" :class="`btn-${lowercase(postType)}`" v-on:change.passive="manageOp">
							<option value="" disabled selected hidden>{{ t('Manage Post') }}</option>
							<option v-if="post.isApproved" value="edit">{{ t('Edit Post') }}</option>
							<option v-if="post.isApproved && closedType" value="mark" >{{ t(markMessage) }}</option>
<!-- {{ t('TAKEN') }}
{{ t('RECEIVED') }}
{{ t('Mark As Taken') }}
{{ t('Mark As Received') }}
{{ t('Cancel Post') }}
(this cuz of dumb i18n parser...) -->
              <option v-else-if="postType === 'LEND'" :value="lent ? 'return' : 'lend'">
                <span v-if="lent">{{ t('Item Returned') }}</span><span v-else>{{ t('Lend Item') }}</span>
              </option>
							<option value="delete">{{ t('Cancel Post') }}</option>
							<option v-if="post.isApproved" value="replies">{{ t('See Replies') }}</option>
						</select>
					</template>
					<template v-else-if="lent && viewer === post.share.borrowerId">
						<p v-if="overdue" class="callout warning">
                            {{ t('Item Overdue!') }}<span v-if="due"> {{ t('It was due on') }} {{ due }}</span>
							<a :href="`/home/my-replies?type=post&id=${post.id}`">{{ t("Let your friend know what's up") }}</a>
						</p>
						<p v-else class="callout success">{{ t('BORROWING!') }}<span v-if="due"> {{ t('Due back on') }} {{ due }}</span></p>
					</template>
					<fc-messages-detail-input v-else-if="((['groups_main', 'user'].includes($parent.route.id)  && $parent.isMember ) || !['groups_main','search_posts', 'user'].includes($parent.route.id) && ['OFFER', 'WANTED', 'LEND', 'BORROW'].includes(postType))" :subject="t('Reply to your post') + ': ' + post.subject" topic-type="post" :topic-id="String(post.id)" :custom-trigger="replyButton">
						<p><strong>{{ t('New Message Re') }}:</strong> {{ post.subject }}</p>
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
