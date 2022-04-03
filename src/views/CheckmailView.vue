<template>
	<section class="flex flex-col sm:flex-row h-screen items-center">
		<header class="hidden lg:block absolute z-10 top-0 left-0 right-0 px-2 mx-auto">
			<img class="mt-12 ml-8 w-40" src="https://speculare.cloud/assets/imgs/icon.svg">
		</header>

		<div class="bg-white w-full lg:max-w-full md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
			<div class="w-full h-100">
				<img class="block w-52 mb-12 lg:mb-0 lg:hidden lg:mt-12 lg:ml-8 lg:w-40" src="https://speculare.cloud/assets/imgs/icon.svg">

				<h1 class="mb-6 text-3xl">
					Check your mailbox
				</h1>

				<p class="mb-6">
					<span class="block">With passwordless login, you do not need to remember a password. <a href="#" class="text-blue-500 hover:text-blue-600">Read more about it here</a>.</span>
					<span>We have just sent you an email at your address, click on the button to log in.</span>
				</p>

				<p class="text-gray-400 text-center mt-12">
					Do not have an account yet? <router-link key="register" :to="{ name: 'Register' }" class="text-blue-500 hover:text-blue-600">
						Create one
					</router-link>
				</p>
			</div>
		</div>

		<div class="bg-blue-600 hidden sm:block w-full md:w-1/2 xl:w-2/3 h-screen">
			<img src="https://source.unsplash.com/random" class="w-full h-full object-cover" loading="lazy">
		</div>
	</section>
</template>

<script>
export default {
	name: 'Wait',
}
</script>
