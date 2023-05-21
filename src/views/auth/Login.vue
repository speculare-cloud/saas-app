<template>
	<section class="flex flex-col sm:flex-row h-screen items-center">
		<header class="hidden lg:block absolute z-10 top-0 left-0 right-0 px-2 mx-auto">
			<img class="w-48 mt-12 ml-8" src="@/assets/logo.svg" alt="speculare logo">
		</header>

		<div class="w-full lg:max-w-full md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
			<div class="w-full h-100">
				<img class="block w-52 mb-12 lg:mb-0 lg:hidden lg:mt-12 lg:ml-8 lg:w-40" src="@/assets/logo.svg" alt="speculare logo">

				<h1 class="mb-6 text-3xl">
					Speculare Monitoring Platform
				</h1>

				<p class="mb-6 text-base-content">
					<span class="block">Welcome back!</span>
					<span>Please log in to your account.</span>
				</p>

				<form class="mt-6" @submit.prevent="sendRequest">
					<div class="form-control w-full">
						<label class="label">
							<span class="label-text">What is your email?</span>
						</label>
						<input
							ref="emailField" autocomplete="email" name="email" type="email"
							placeholder="john.doe@speculare.cloud"
							class="input input-bordered w-full bg-base-300" :class="getInputStyle(emailState)"
							v-model="emailAddr" style="font-size: 0.875rem;">
						<div class="input-error mt-2 text-error" :class="emailState >= 2 ? 'block' : 'hidden'">
							<span v-if="emailState == 3">Email address cannot be empty.</span>
							<span v-if="emailState == 2">Email is not valid.</span>
						</div>
					</div>

					<button type="submit" class="btn btn-md btn-info flex w-full justify-center items-center mt-6 text-white">
						<div class="flex mr-2">
							<svg v-if="!requestLoading" class="w-4 h-4 min-h-[1em] min-w-[1em] align-middle" fill="currentColor" viewBox="0 0 24 24">
								<path d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z" />
							</svg>
							<svg
								v-if="requestLoading" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
								viewBox="0 0 24 24">
								<circle
									class="opacity-25" cx="12" cy="12" r="10"
									stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
						</div>
						<span v-if="!requestLoading">Send a magic link</span>
						<span v-if="requestLoading">Sending...</span>
					</button>
				</form>

				<p class="text-base-content text-center mt-12">
					Do not have an account yet? <router-link key="register" :to="{ name: 'Register' }" class="text-info">
						Create one
					</router-link>
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
import { FieldState, getInputStyle, validateEmail } from '@/utils/help';

export default {
	name: 'Login',

	setup () {
		const curHr = new Date().getHours()
		const timeOfDay = 5 <= curHr && curHr <= 11 ? 'morning' : 12 <= curHr && curHr <= 17 ? 'afternoon' : 'night';

		return { getInputStyle, timeOfDay }
	},

	data () {
		return {
			emailAddr: "",
			emailState: FieldState.None,
			requestLoading: false,
		}
	},

	methods: {
		sendRequest: async function() {
			if (this.requestLoading) return;
			if (this.emailAddr == "") return this.emailState = FieldState.Empty;
			if (!validateEmail(this.emailAddr)) return this.emailState = FieldState.Error;

			this.emailState = FieldState.Success;
			this.requestLoading = true;

			console.log("Sending request for email: ", this.emailAddr);
			await this.$http.post(this.$authBase + "/api/sso", { email: this.emailAddr }).then(() => {
				// Redirect to the wait page
				this.$router.replace({ name: 'Wait' });
			}).catch((err) => {
				if (err.response) {
					this.emailState = FieldState.Error;
					switch (err.response.status) {
					case 404:
						// showToast("We didn't recognize this e-mail.\nDo you want to sign up instead?", "error");
						break;
					default:
						// showToast("Please, verify your information and try again...", "error");
						break;
					}
				} else {
					console.error(err);
					// showToast("Unknown error, try again later...", "error");
				}
			}).finally(() => {
				this.requestLoading = false;
			});
		}
	}
}
</script>