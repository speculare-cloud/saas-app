<template>
	<div>
		<p>Hello World</p>

		<button @click="generateKey" class="mb-2 flex w-full justify-center items-center bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white rounded-lg px-4 py-3 mt-6">
			<span>Generate new key</span>
		</button>

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
		},
		generateKey: async function() {
			await axios.post("https://auth.speculare.cloud/api/key", { withCredentials: true })
				.then((resp) => {
					console.log("New key: ", resp);
				}).catch((err) => {
					console.log(err);
				});
		}
	}
}
</script>