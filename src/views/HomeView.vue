<template>
	<div class="overflow-x-hidden w-full h-screen">
		<div class="max-w-6xl mx-auto">
			<header class="navbar bg-base-100">
				<div class="flex-1">
					<a class="btn btn-ghost normal-case text-xl">Speculare</a>
				</div>
				<div class="flex-none">
					<div class="dropdown dropdown-end">
						<label tabindex="0" class="btn btn-ghost btn-circle avatar">
							<div class="w-10 rounded-full">
								<img src="https://avatars.dicebear.com/api/bottts/speculare.svg">
							</div>
						</label>
						<ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52" data-theme="light">
							<li><a>Settings</a></li>
							<li><a @click="logout">Logout</a></li>
						</ul>
					</div>
				</div>
			</header>

			<main class="mt-6 px-6">
				<div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
					<h3 class="text-2xl">
						Have a great day!
					</h3>
					<button @click="generateKey" class="btn" style="width: fit-content;">
						Add new
					</button>
				</div>

				<div class="card w-full bg-neutral text-neutral-content">
					<div v-for="item in keys" :key="item.key" class="card-body flex-col sm:flex-row sm:items-center sm:justify-between px-6 sm:px-8 py-4">
						<div class="flex-1 flex items-center justify-between sm:justify-start sm:gap-4">
							<div class="badge badge-lg bg-base-100 py-4">
								Berta {{ item.berta }}
							</div>
							<h2 class="card-title">
								{{ trunk(item.host) }}
							</h2>
						</div>
						<div class="flex-1 form-control">
							<div class="input-group gap-2">
								<input
									v-if="item.show" :value="item.key" type="text" class="input w-full focus:outline-none"
									readonly>
								<input
									v-else type="password" :value="item.key" class="input w-full focus:outline-none text-3xl"
									readonly>
								<button class="btn btn-square" @click="toggleShow(item)">
									show
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import { nextTick } from 'vue'

export default {
	name: 'Home',

	data () {
		return {
			keys: [{
				key: "AZQpE53HqYUnIPww7J0MltSdzFRELB2e",
				host: "4fcf4b4f65721729a82d61a2bcf32c74637ad2c6",
				berta: "B1",
				show: false,
			}, {
				key: "AZQpE53HqYUnIPww7J0MltSdzFRELB2e",
				host: "b131f5adb1b3ff662d355085036005b15bc34677",
				berta: "B1",
				show: false,
			}],
		}
	},

	mounted: function () {
		const vm = this

		nextTick(() => {
			vm.$http.get("https://auth.speculare.cloud/api/key")
				.then((resp) => {
					console.log(resp);
					
					// TODO - Remove cleanup and default data
					vm.keys = [];
					resp.data.forEach(elem => {
						const newObj = {
							key: elem.key,
							host: elem.host_uuid,
							berta: elem.berta,
							show: false
						};

						vm.keys.push(newObj);
					});
				}).catch((err) => {
					console.log(err);
				});
		})
	},

	methods: {
		trunk: function(text) {
			return text.slice(0, 6);
		},
		toggleShow: function(item) {
			item.show = !item.show;
		},
		logout: async function() {
			await this.$http.get("https://auth.speculare.cloud/api/logout")
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
			await this.$http.post("https://auth.speculare.cloud/api/key", {})
				.then((resp) => {
					console.log("New key: ", resp);
				}).catch((err) => {
					console.log(err);
				});
		}
	}
}
</script>