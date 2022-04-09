<template>
	<div class="drawer">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle"> 
		<div class="drawer-content flex flex-col">
			<!-- Navbar -->
			<div class="bg-neutral text-neutral-content">
				<header class="navbar max-w-6xl mx-auto">
					<div class="flex-none md:hidden">
						<label for="my-drawer-3" class="btn btn-square btn-ghost">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
						</label>
					</div>
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
							<ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52">
								<li><a>Settings</a></li>
								<li><a @click="logout">Logout</a></li>
							</ul>
						</div>
					</div>
				</header>
			</div>
			<!-- Page content here -->
			<main class="flex-1 w-full flex justify-center">
				<section class="flex-1 max-w-6xl px-6 py-6 flex flex-row justify-center">
					<div class="hidden md:block sticky">
						<ul class="menu bg-neutral text-neutral-content w-52 p-2 rounded-box gap-2">
							<li>
								<a class="currentSideNav">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
										<path d="M13 18.002a.998.998 0 0 1-.94-.658L8.986 8.889l-2.048 5.465a1.001 1.001 0 0 1-1.794.163l-2.187-3.645-1.124 1.685a1.001 1.001 0 0 1-1.664-1.11l2-3a.966.966 0 0 1 .856-.445.997.997 0 0 1 .833.485l1.935 3.224 2.27-6.06A1 1 0 0 1 9 5h.005a1 1 0 0 1 .935.659l2.946 8.102 3.152-11.035c.12-.421.502-.715.94-.725.43-.026.833.268.97.684l2 6a1 1 0 1 1-1.896.632l-.98-2.933-3.11 10.89a1 1 0 0 1-.927.726H13" />
									</svg>
									Servers
								</a>
							</li>
							<li>
								<a>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
										<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8M9.977 7c.026 0 .649.04 1.316.707a1 1 0 0 0 1.414-1.414A4.487 4.487 0 0 0 11 5.2V5a1 1 0 1 0-2 0v.184A2.996 2.996 0 0 0 7 8c0 2.28 1.727 2.713 2.758 2.97C10.873 11.25 11 11.354 11 12c0 .552-.448 1-.976 1-.026 0-.65-.04-1.317-.707a1 1 0 0 0-1.414 1.415A4.502 4.502 0 0 0 9 14.798v.2a1 1 0 1 0 2 0v-.184A2.995 2.995 0 0 0 13 12c0-2.28-1.726-2.712-2.757-2.97C9.128 8.752 9 8.646 9 8c0-.55.449-1 .977-1" />
									</svg>
									Billing
								</a>
							</li>
							<li>
								<a>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
										<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-4.1a1.1 1.1 0 1 0 .001 2.201A1.1 1.1 0 0 0 10 13.9M10 4C8.625 4 7.425 5.161 7.293 5.293A1.001 1.001 0 0 0 8.704 6.71C8.995 6.424 9.608 6 10 6a1.001 1.001 0 0 1 .591 1.808C9.58 8.548 9 9.616 9 10.737V11a1 1 0 1 0 2 0v-.263c0-.653.484-1.105.773-1.317A3.013 3.013 0 0 0 13 7c0-1.654-1.346-3-3-3" />
									</svg>
									Help & Support
								</a>
							</li>
						</ul>
					</div>
					<div class="hidden md:divider md:divider-horizontal" /> 
					<div class="flex-1">
						<div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
							<h3 class="text-2xl">
								Have a great day!
							</h3>
							<button @click="generateKey" class="btn bg-neutral h-9 min-h-6 lowercase" style="width: fit-content;">
								Add new
							</button>
						</div>

						<div v-for="item in rawKeys" :key="item.key" tabindex="0" class="collapse collapse-arrow bg-neutral text-neutral-content shadow-xl rounded-box mb-2">
							<input type="checkbox" class="peer">
							<div class="collapse-title text-xl font-medium p-3 min-h-min">
								<div class="flex-1 flex items-center justify-between sm:justify-start">
									<div class="tooltip tooltip-right tooltip-primary" data-tip="Assigned berta.">
										<div class="bg-primary text-primary-content badge badge-lg py-4">
											{{ item.berta }}
										</div>
									</div>
									<h2 class="flex-1 card-title text-base font-normal ml-2">
										{{ item.hostname ?? trunk(item.host) ?? "waiting data..." }}
									</h2>
								</div>
							</div>
							<div class="collapse-content">
								<div class="form-control">
									<label class="label">
										<span class="label-text">Secret key</span>
									</label>
									<label class="input-group">
										<input
											v-if="item.show" :value="item.key" type="text" class="input input-bordered w-full focus:outline-none h-9"
											readonly>
										<input
											v-else type="password" :value="item.key" class="input input-bordered w-full focus:outline-none text-3xl h-9"
											readonly>
										<button class="btn btn-primary h-9 min-h-6 text-sm lowercase" @click="toggleShow(item)">show</button>
									</label>
								</div>
							</div>
						</div>

						<div class="flex items-center justify-center mt-8">
							<div class="alert shadow-lg bg-neutral p-3" style="width: auto;">
								<div>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Need help? Let us know at <a href="mailto:contact@speculare.cloud" class="text-info">contact@speculare.cloud</a></span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div> 
		<div class="drawer-side">
			<label for="my-drawer-3" class="drawer-overlay" /> 
			<ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
				<!-- Sidebar content here -->
				<li>
					<a class="currentSideNav">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
							<path d="M13 18.002a.998.998 0 0 1-.94-.658L8.986 8.889l-2.048 5.465a1.001 1.001 0 0 1-1.794.163l-2.187-3.645-1.124 1.685a1.001 1.001 0 0 1-1.664-1.11l2-3a.966.966 0 0 1 .856-.445.997.997 0 0 1 .833.485l1.935 3.224 2.27-6.06A1 1 0 0 1 9 5h.005a1 1 0 0 1 .935.659l2.946 8.102 3.152-11.035c.12-.421.502-.715.94-.725.43-.026.833.268.97.684l2 6a1 1 0 1 1-1.896.632l-.98-2.933-3.11 10.89a1 1 0 0 1-.927.726H13" />
						</svg>
						Servers
					</a>
				</li>
				<li>
					<a>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
							<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8M9.977 7c.026 0 .649.04 1.316.707a1 1 0 0 0 1.414-1.414A4.487 4.487 0 0 0 11 5.2V5a1 1 0 1 0-2 0v.184A2.996 2.996 0 0 0 7 8c0 2.28 1.727 2.713 2.758 2.97C10.873 11.25 11 11.354 11 12c0 .552-.448 1-.976 1-.026 0-.65-.04-1.317-.707a1 1 0 0 0-1.414 1.415A4.502 4.502 0 0 0 9 14.798v.2a1 1 0 1 0 2 0v-.184A2.995 2.995 0 0 0 13 12c0-2.28-1.726-2.712-2.757-2.97C9.128 8.752 9 8.646 9 8c0-.55.449-1 .977-1" />
						</svg>
						Billing
					</a>
				</li>
				<li>
					<a>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
							<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-4.1a1.1 1.1 0 1 0 .001 2.201A1.1 1.1 0 0 0 10 13.9M10 4C8.625 4 7.425 5.161 7.293 5.293A1.001 1.001 0 0 0 8.704 6.71C8.995 6.424 9.608 6 10 6a1.001 1.001 0 0 1 .591 1.808C9.58 8.548 9 9.616 9 10.737V11a1 1 0 1 0 2 0v-.263c0-.653.484-1.105.773-1.317A3.013 3.013 0 0 0 13 7c0-1.654-1.346-3-3-3" />
						</svg>
						Help & Support
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { nextTick, ref } from 'vue'

export default {
	name: 'Home',

	data () {
		return {
			bertas: [],
			rawKeys: ref([]),
		}
	},

	mounted: function () {
		const vm = this

		nextTick(async () => {
			await vm.refreshList();
		})
	},

	methods: {
		refreshList: async function() {
			await this.$http.get(this.$authBase + "/api/key")
				.then((resp) => {
					console.log(resp);
					
					resp.data.forEach(elem => {
						if (!this.bertas.includes(elem.berta)) {
							console.log("Adding new berta", elem.berta);
							this.bertas.push(elem.berta);
						}

						const newObj = {
							key: elem.key,
							host: elem.host_uuid,
							berta: elem.berta,
							show: false
						};

						this.rawKeys.push(newObj);
					});
				}).catch((err) => {
					console.log(err);
				});

			this.bertas.forEach(async (elem) => {
				console.log("Gathering for Berta", elem);

				let bertaUrl = this.$bertaOverride ? this.$bertaOverride : "https://server.speculare.cloud";
				await this.$http.get(bertaUrl + "/api/hosts")
					.then((resp) => {
						console.log(resp);
					
						resp.data.forEach(elem => {
							// TODO - rkey can (maybe?) be undefined
							let rkey = this.rawKeys.find((e) => e.host == elem.uuid);

							rkey.hostname = elem.hostname;
							rkey.os = elem.system;
						});
					}).catch((err) => {
						console.log(err);
					});
			});
		},
		trunk: function(text) {
			if (text === null) return undefined
			return text.slice(0, 6);
		},
		toggleShow: function(item) {
			item.show = !item.show;
		},
		logout: async function() {
			await this.$http.get(this.$authBase + "/api/logout")
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
			await this.$http.post(this.$authBase + "/api/key", {})
				.then(async (resp) => {
					console.log("New key: ", resp);
					await this.refreshList();
				}).catch((err) => {
					console.log(err);
				});
		}
	}
}
</script>