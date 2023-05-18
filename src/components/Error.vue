<template>
	<section class="mt-12 flex justify-center items-center h-52">
		<div class="prose-sm flex flex-col justify-center align-middle">
			<h1 class="mb-2">
				Unexpected Error
			</h1>
			<p>
				Please check the
				<a href="https://status.speculare.cloud/" target="_blank" class="text-green-400">status of our services</a>
				or
				<router-link key="help" :to="{ name: 'Help' }" class="text-green-400">
					contact the support
				</router-link>
				.
			</p>
		</div>
	</section>
</template>

<script lang="ts">
export default {
	name: 'Error',
}
</script>