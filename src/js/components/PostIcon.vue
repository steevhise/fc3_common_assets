<template>
	<!-- TODO Find an actual strategy for dealing w/ svgs -->
	<div class="post-list-item-category-icon" :style="margin">
		<div v-if="post.type.name === 'OFFER'">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-offer">
						<path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
						<path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
			</svg>
			<span class="text-offer">Offer</span>
		</div>
		<div v-if="post.type.name === 'LEND'">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-lend">
					<path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
					<path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
			</svg>
			<span class="text-lend">Lend</span>
		</div>
		<div v-if="post.type.name === 'BORROW'">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-borrow">
					<path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
					<path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
			</svg>
			<span class="text-borrow">Borrow</span>
		</div>
		<div v-if="post.type.name === 'WANTED'">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-wanted">
					<path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"/>
					<path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"/>
			</svg>
			<span class="text-wanted">Wanted</span>
		</div>
		<div v-if="post.type.name === 'TAKEN'">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25" width="20" height="25" class="icon-chevron-taken">
					<path d="M0 0v17.499l10 7.501v-17.501l-10-7.499z"></path>
					<path d="M20 0l-10 7.499v17.501l10-7.501v-17.499z"></path>
			</svg>
			<span class="text-taken">Taken</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fc-post-icon',
		props: {
			post: Object
		},
		data() {
			return {}
		},
		computed: {
			margin() {

					// Override for icon block margin; ensures TAKEN appears on 1 line
					// like the rest of our icons
					return this.post.type.name === 'TAKEN' && { marginRight: '2px' };
			}
		}
	}
</script>
