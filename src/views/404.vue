<template>
	<section class="h-screen">
		<div class="h-full md:flex justify-center">
			<div class="prose-sm flex flex-col justify-center align-middle">
				<div>
					<router-link key="home" :to="{ path: '/' }" class="btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3 !pl-0 !pr-2">
						<svg
							xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8" width="24" height="24"
							viewBox="0 0 24 24">
							<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
						</svg>
						<div class="flex flex-col items-start">
							<span class="text-base-content hidden text-xs font-normal md:block">Back</span>
							<span class="text-white">Home</span>
						</div>
					</router-link>
				</div>
				<h1 class="mt-4">
					404 Not Found
				</h1>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	name: '404',
}
</script>