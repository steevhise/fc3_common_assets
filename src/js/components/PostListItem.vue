<template>
	<div class="post-list-item" >
		<div class="post-list-item-photo">
			<img width="128" :src="post.thumb" v-if="post.thumb">
			<fc-icon name="logo" v-else></fc-icon>
		</div>
		<div class="post-list-item-content">
			<div class="post-list-item-content-header">
				<div class="post-list-item-header-left">
					<div class="post-list-item-category-icon">
						<fc-icon name="chevron" :classname="`icon-chevron-${postType}`"></fc-icon>
					</div>
					<div class="post-list-item-header-icon">
						<fc-icon name="map_pin"></fc-icon>
						<span>{{ post.group.name }}</span>
					</div>
				</div>
				<div class="post-list-item-header-right">
					<span class="text-lighten">{{ post.date | mreldate }}</span>
					<button :class="`btn-${postType}`">Reply</button>
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