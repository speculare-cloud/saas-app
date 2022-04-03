<template>
	<section class="flex flex-col sm:flex-row h-screen items-center">
		<header class="hidden lg:block absolute z-10 top-0 left-0 right-0 px-2 mx-auto">
			<img class="mt-12 ml-8 w-40" src="https://speculare.cloud/assets/imgs/icon.svg">
		</header>

		<div class="bg-white w-full lg:max-w-full md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
			<div class="w-full h-100">
				<img class="block w-52 mb-12 lg:mb-0 lg:hidden lg:mt-12 lg:ml-8 lg:w-40" src="https://speculare.cloud/assets/imgs/icon.svg">

				<h1 class="mb-6 text-3xl">
					Create Your Speculare Account
				</h1>

				<p class="mb-6 text-gray-400">
					Welcome!
				</p>

				<div class="mt-6">
					<div class="input-holder">
						<div class="input-label-holder">
							<input
								ref="emailField" autocomplete="on" name="email" placeholder="john.doe@speculare.cloud"
								type="email" class="input-field border-solid border-[1px]" :class="(emailEmpty || !emailValid) ? 'border-red-500' : 'border-blue-500'" v-model="emailAddr"
								@input="checkEmail">
							<label aria-live="assertive" class="input-label" :class="(emailEmpty || !emailValid) ? 'text-red-500' : 'text-gray-400'">Email address</label>
							<div class="input-mandatory-holder">
								<svg class="input-svg" viewBox="0 0 24 24">
									<path d="M10,2H14L13.21,9.91L19.66,5.27L21.66,8.73L14.42,12L21.66,15.27L19.66,18.73L13.21,14.09L14,22H10L10.79,14.09L4.34,18.73L2.34,15.27L9.58,12L2.34,8.73L4.34,5.27L10.79,9.91L10,2Z" />
								</svg>
							</div>
						</div>
						<div class="input-error-holder" :class="(emailEmpty || !emailValid) ? 'block' : 'hidden'">
							<div class="input-error">
								<span v-if="emailEmpty">Email address cannot be empty.</span>
								<span v-if="!emailEmpty && !emailValid">Email is not valid.</span>
							</div>
						</div>
					</div>

					<button @click="sendRequest" class="mb-2 flex w-full justify-center items-center bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white rounded-lg px-4 py-3 mt-6">
						<div class="flex mr-2">
							<svg v-if="!requestLoading" class="w-4 h-4 min-h-[1em] min-w-[1em] align-middle" style="fill: currentcolor;" viewBox="0 0 24 24">
								<path d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z" />
							</svg>
							<svg
								v-if="requestLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
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
					<div class="flex items-center text-gray-400">
						<svg class="w-8 h-8 align-top mr-2" style="fill: currentcolor;" viewBox="0 0 24 24">
							<path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
						</svg>
						<p class="text-xs">
							To learn more about how we protect your personal data and how to exercise your rights, please visit our <a class="text-blue-500" href="#">Privacy Policy</a>.
						</p>
					</div>
				</div>

				<p class="text-gray-400 text-center mt-12">
					Already have an account? <router-link key="login" :to="{ name: 'Login' }" class="text-blue-500 hover:text-blue-600">
						Log in
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
import axios from 'axios'

export default {
	name: 'Register',

	data () {
		return {
			emailAddr: "",
			emailEmpty: false,
			emailValid: true,
			requestLoading: false,
		}
	},

	// React to isLogged
	watch: {
		'$store.state.isLogged': function(value) {
			console.log("isLogged Updated: ", value);
			if (value) {
				this.$router.replace({ name: 'Home' });
			}
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
			this.emailEmpty = this.emailAddr == "";
			this.emailValid = this.validateEmail(this.emailAddr);
		},
		sendRequest: async function() {
			// If the email is not valid, don't send
			if (this.requestLoading || !this.validateEmail(this.emailAddr)) return;

			this.requestLoading = true;
			console.log("Sending request for email: ", this.emailAddr);
			await axios.post("https://auth.speculare.cloud/api/rsso", {
				email: this.emailAddr
			}).then((resp) => {
				console.log("Success", resp);
				// Redirect to the wait page
				this.$router.replace({ name: 'Wait' });
			}).catch((err) => {
				console.log("Error", err);
			}).finally(() => {
				this.requestLoading = false;
			});
		}
	}
}
</script>
