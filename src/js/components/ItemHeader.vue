<template>
	<div class="post-grid-item-header">
		<div class="post-grid-item-header-left">
			<div class="post-grid-item-category-icon">
				<fc-icon name="chevron" :classname="`icon-chevron-${lowercase(postType)}`"></fc-icon>
				<span :class="`text-${lowercase(postType)}`">{{lowercase(postType)}}</span>
			</div>
			<div v-if="lendDuration" style="margin: 0 2rem">
				<strong>Lend Duration: </strong>{{lendDuration}} days
			</div>
		</div>
		<div class="post-grid-item-header-right">
			<div class="post-grid-item-header-icon" v-if="groupName">
				<span>{{groupName}}</span>
				<fc-icon name="map_pin"></fc-icon>
				<span>{{postLocation}}</span>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		name: 'fc-item-header',
		props: ['postType', 'postLocation', 'groupName', 'lendDuration']
	}
</script>