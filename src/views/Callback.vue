<template>
	<div />
</template>

<script>
import axios from 'axios'

export default {
	name: 'Callback',

	beforeCreate() {
		if (this.$route.query.jwt === undefined) {
			// TODO - Pass error as state
			this.$router.replace({ name: 'Login' });
			return;
		}

		axios.get("https://auth.speculare.cloud/api/csso?jwt=" + this.$route.query.jwt)
			.then((resp) => {
				console.log("Success", resp);
				// Redirect to the Home page
				this.$router.replace({ name: 'Home' });
			}).catch((err) => {
				console.log("Error", err);
				// Redirect to the Login page
				// TODO - Pass error as state
				this.$router.replace({ name: 'Login' });
			});
	}
}
</script>
