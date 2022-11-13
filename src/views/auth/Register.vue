<template>
	<section class="flex flex-col sm:flex-row h-screen items-center">
		<header class="hidden lg:block absolute z-10 top-0 left-0 right-0 px-2 mx-auto">
			<img class="w-48 mt-12 ml-8" src="@/assets/logo.svg">
		</header>

		<div class="w-full lg:max-w-full md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
			<div class="w-full h-100">
				<img class="block w-52 mb-12 lg:mb-0 lg:hidden lg:mt-12 lg:ml-8 lg:w-40" src="@/assets/logo.svg">

				<h1 class="mb-6 text-3xl">
					Create Your Speculare Account
				</h1>

				<h2 class="mb-6 text-base">
					Registration are currently closed but you can subscribe to the waiting list.
				</h2>

				<div class="mt-6">
					<div class="form-control w-full">
						<label class="label">
							<span class="label-text">What is your email?</span>
						</label>
						<input
							ref="emailField" autocomplete="on" name="email" type="email"
							placeholder="john.doe@speculare.cloud"
							class="input input-bordered w-full bg-base-300" :class="(emailEmpty || !emailValid) ? 'input-error' : 'input-success'"
							v-model="emailAddr" @input="checkEmail" style="font-size: 0.875rem;">
						<div class="input-error mt-2 text-error" :class="(emailEmpty || !emailValid) ? 'block' : 'hidden'">
							<span v-if="emailEmpty">Email address cannot be empty.</span>
							<span v-if="!emailEmpty && !emailValid">Email is not valid.</span>
						</div>
					</div>

					<button @click="sendRequest" class="btn btn-info flex w-full justify-center items-center mt-6 text-white">
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
						<span v-if="!requestLoading">Get started!</span>
						<span v-if="requestLoading">Sending...</span>
					</button>

					<div class="flex items-center text-base-content mt-2">
						<svg class="w-12 h-12 align-top mr-4" style="fill: currentcolor;" viewBox="0 0 24 24">
							<path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
						</svg>
						<p class="text-sm">
							To learn more about how we protect your personal data and how to exercise your rights, please visit our <a class="text-info" href="#">Privacy Policy</a>.
						</p>
					</div>
				</div>

				<p class="text-base-content text-center mt-12">
					Already have an account? <router-link key="login" :to="{ name: 'Login' }" class="text-info">
						Log in
					</router-link>
				</p>
			</div>
		</div>

		<div class="relative hidden sm:block w-full md:w-1/2 xl:w-2/3 h-screen">
			<img src="https://source.unsplash.com/random/?city,night" class="w-full h-full object-cover" loading="lazy">
			<div class="absolute bottom-0 text-sm right-0 p-2 m-2 rounded-md bg-black bg-opacity-50">
				credit: <a href="https://unsplash.com">unsplash.com</a>
			</div>
		</div>
	</section>
</template>

<script>
import { useMainStore } from '@/stores/main';

export default {
	name: 'Register',

	setup () {
		const store = useMainStore();
		return { store }
	},

	data () {
		return {
			emailAddr: "",
			emailEmpty: false,
			emailValid: true,
			requestLoading: false,
		}
	},
	methods: {
		validateEmail: function(email) {
			return String(email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
		},
		checkEmail: function() {
			this.emailValid = this.validateEmail(this.emailAddr);
		},
		sendRequest: async function() {
			this.emailEmpty = this.emailAddr == "";
			// If the email is not valid, don't send
			if (this.requestLoading || !this.validateEmail(this.emailAddr)) return;
			this.requestLoading = true;
			console.log("Sending request for email: ", this.emailAddr);
			await this.$http.post(this.$authBase + "/api/rsso", {
				email: this.emailAddr
			}).then(() => {
				// Redirect to the wait page
				this.$router.replace({ name: 'Wait' });
			}).catch(() => {
				// TODO - Open registration once the MAIL system is prepared.
				return this.store.showToast("Successfully added to the waiting list.", "success");

				/*if (err.response) {
					if (400 <= err.response.status < 500) {
						this.store.showToast("Please, verify your information and\nmake sure you don't already have an account.", "error");
					} else {
						this.store.showToast("Unknown error, please try again later...", "error");
					}
				} else {
					console.error(err);
					this.store.showToast("Unknown error, try again later...", "error");
				}*/
			}).finally(() => {
				this.requestLoading = false;
			});
		}
	}
}
</script>