<template>
	<section>
		<div class="flex-col">
			<router-link key="home" :to="{ name: 'Home' }" class="btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3 !pl-0 !pr-2">
				<svg
					xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8" width="24" height="24"
					viewBox="0 0 24 24">
					<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
				</svg>
				<div class="flex flex-col items-start">
					<span class="text-base-content/50 hidden text-xs font-normal md:block">Prev</span>
					<span>Servers</span>
				</div>
			</router-link>
			<div class="prose-sm flex justify-between items-center mt-4">
				<h1>
					New server
				</h1>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	name: 'NewServer',

	data () {
		return {}
	},

	mounted: function () {},
}
</script>