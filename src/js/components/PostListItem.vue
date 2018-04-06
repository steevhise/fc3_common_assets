<template>
	<div class="post-list-item" >
		<div class="post-list-item-photo">
			<img width=128 :src="post.thumb" v-if="post.thumb">
		</div>
		<div class="post-list-item-content">
			<div class="post-list-item-content-header">
				<div class="post-list-item-header-left">
					<div class="post-list-item-category-icon">
						<!-- {% include "./post_type.html" with { post : post } %} -->
					</div>
					<div class="post-list-item-header-icon">
						<!-- {% include '../icons/map_pin.html' %} -->
						<span>{{ post.group.name }}</span>
					</div>
				</div>
				<div class="post-list-item-header-right">
					<span class="text-lighten">{{ post.date | mreldate }}</span>
					<button :class="`btn-${post.category}`">Reply</button>
				</div>
			</div>
			<div class="post-list-item-content-description">
				<h4><a :href="path.posts_detail + post.post_id">{{ post.subject }}</a></h4>
				<p class="paragraph-small" v-html="post.description"></p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-post-list-item',
		props: ['post', 'path'],
		mounted() {
			console.log(this.post, this.path);
		}
	}
</script>