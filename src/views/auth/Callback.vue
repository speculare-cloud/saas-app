<template>
	<div />
</template>

<script lang="ts">
import { useMainStore } from '@/stores/main';

export default {
	name: 'Callback',

	setup () {
		const store = useMainStore();
		return { store }
	},

	beforeCreate() {
		if (this.$route.query.jwt === undefined) {
			// showToast("Incorrect request, try again...", "error");
			this.$router.replace({ name: 'Login' });
			return;
		}

		this.$http.get(this.$authBase + "/api/csso?jwt=" + this.$route.query.jwt)
			.then((resp) => {
				console.log(resp);
				// Redirect to the Home page
				this.store.logged(resp.data);
				this.$router.replace({ name: 'Base' });
			}).catch((err) => {
				console.error("Error", err);
				// Redirect to the Login page
				// showToast("Failed to authenticate, try again...", "error");
				this.$router.replace({ name: 'Login' });
			});
	}
}
</script>
