<template>
	<div />
</template>

<script>
import { useMainStore } from '@/stores/main';

export default {
	name: 'Callback',

	setup () {
		const store = useMainStore();
		return { store }
	},

	beforeCreate() {
		if (this.$route.query.jwt === undefined) {
			// TODO - Pass error as state
			this.$router.replace({ name: 'Login' });
			return;
		}

		this.$http.get(this.$authBase + "/api/csso?jwt=" + this.$route.query.jwt)
			.then(() => {
				// Redirect to the Home page
				this.store.setLogged(true);
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
