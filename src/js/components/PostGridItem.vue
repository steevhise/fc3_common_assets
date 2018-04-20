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
						<div class="post-grid-item-header-icon">
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
						<span class="text-lighten">{{ post.date | mreldate }}</span>
					</div>
					<div class="post-grid-item-header-right">
						<button :class="`btn-${postType}`">Reply</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-post-grid-item',
		props: ['item', 'path', 'index'],
		data() {
			return {
				post: this.item
			}
		},
		computed: {
			postType() {
				return this.post.type.name.toLowerCase();
			}
		}
	}
</script>