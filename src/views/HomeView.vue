<template>
	<div>
		<p>Hello World</p>
		<button @click="logout" class="mb-2 flex w-full justify-center items-center bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white rounded-lg px-4 py-3 mt-6">
			<span>Logout</span>
		</button>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Home',

	methods: {
		logout: async function() {
			await axios.get("https://auth.speculare.cloud/api/logout", { withCredentials: true })
				.then(() => {
					this.$store.commit({
						type: 'setLogged',
						isLogged: false
					});
					this.$router.replace({ name: 'Login' });
				}).catch((err) => {
					console.log(err);
				});
		}
	}
}
</script>