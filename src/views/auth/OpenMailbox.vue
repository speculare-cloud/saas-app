<template>
	<section class="flex flex-col sm:flex-row h-screen items-center">
		<header class="hidden lg:block absolute z-10 top-0 left-0 right-0 px-2 mx-auto">
			<img class="w-48 mt-12 ml-8" src="@/assets/logo.svg" alt="speculare logo">
		</header>

		<div class="w-full lg:max-w-full md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
			<div class="w-full h-100">
				<img class="block w-52 mb-12 lg:mb-0 lg:hidden lg:mt-12 lg:ml-8 lg:w-40" src="@/assets/logo.svg" alt="speculare logo">

				<h1 class="mb-6 text-3xl">
					Check your mailbox
				</h1>

				<p class="mb-6 text-base-content">
					<span class="block">With passwordless login, you do not need to remember a password. <a href="#" class="text-info">Read more about it here</a>.</span>
					<br>
					<span>We have just sent you an email at your address, go to your inbox to find it.</span>
				</p>
			</div>
		</div>

		<div class="relative hidden sm:block w-full md:w-1/2 xl:w-2/3 h-screen">
			<img :src="'https://source.unsplash.com/random/?city,' + timeOfDay" class="w-full h-full object-cover" loading="lazy" alt="random image of city">
			<div class="absolute bottom-0 text-sm right-0 p-2 m-2 rounded-md bg-black bg-opacity-50">
				credit: <a href="https://unsplash.com">unsplash.com</a>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
export default {
	name: 'Wait',

	setup () {
		const curHr = new Date().getHours()
		const timeOfDay = 5 <= curHr && curHr <= 11 ? 'morning' : 12 <= curHr && curHr <= 17 ? 'afternoon' : 'night';

		return { timeOfDay }
	},
}
</script>