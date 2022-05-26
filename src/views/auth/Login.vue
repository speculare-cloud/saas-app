<template>
	<div>
		Login
	</div>
</template>

<script>
export default {
	name: 'Login',

	data () {
		return {
			emailAddr: "",
			emailEmpty: true,
			emailValid: false,
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
			this.emailEmpty = this.emailAddr == "";
			this.emailValid = this.validateEmail(this.emailAddr);
		},
		sendRequest: async function() {
			// If the email is not valid, don't send
			if (this.requestLoading || !this.validateEmail(this.emailAddr)) return;

			this.requestLoading = true;
			console.log("Sending request for email: ", this.emailAddr);
			await this.$http.post(this.$authBase + "/api/sso", {
				email: this.emailAddr
			}).then((resp) => {
				console.log("Success", resp);
				// Get the domain name of the email
				// Redirect to the wait page
				this.$router.replace({ name: 'Wait', params: { emailDomain: this.emailAddr.split('@')[1] } });
			}).catch((err) => {
				console.log("Error", err);
			}).finally(() => {
				this.requestLoading = false;
			});
		}
	}
}
</script>
