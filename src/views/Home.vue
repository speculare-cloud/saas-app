<template>
	<content>
		<div class="md:flex justify-between">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Greetings, Martin
				</h1>
			</div>
			<div class="mt-4 md:mt-0 flex flex-col items-start sm:flex-row sm:space-x-4">
				<div class="mb-3 relative self-stretch sm:mb-0 sm:self-end w-[265px]">
					<svg class="absolute left-[12px] top-[13px]" height="14" viewBox="0 0 14 14" width="14">
						<path
							stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"
							d="M13 13L9.61539 9.61539M11.0513 6.02564C11.0513 6.68562 10.9213 7.33913 10.6687 7.94887C10.4162 8.55861 10.046 9.11263 9.57931 9.57931C9.11263 10.046 8.55861 10.4162 7.94887 10.6687C7.33913 10.9213 6.68562 11.0513 6.02564 11.0513C5.36566 11.0513 4.71215 10.9213 4.10241 10.6687C3.49267 10.4162 2.93865 10.046 2.47198 9.57931C2.0053 9.11263 1.63512 8.55861 1.38255 7.94887C1.12999 7.33913 1 6.68562 1 6.02564C1 4.69276 1.52949 3.41447 2.47198 2.47198C3.41447 1.52949 4.69276 1 6.02564 1C7.35852 1 8.63682 1.52949 9.57931 2.47198C10.5218 3.41447 11.0513 4.69276 11.0513 6.02564Z" />
					</svg>

					<input
						type="text" name="q" id="q" class="form-control font-medium !pl-[34px] h-10 text-neutral-500"
						placeholder="Search monitors" data-target="search--base.searchInput" data-action="keyup->search--base#searchKeyUp blur->search--base#searchBlur" autocomplete="off">
				</div>

				<button class="btn btn-info !h-10 !min-h-[2.5rem] normal-case">
					Create monitor
				</button>
			</div>
		</div>
		<div v-if="rawKeys.length === 0" class="mt-12">
			Nothing yet
		</div>
		<div v-if="rawKeys.length !== 0" class="mt-12 bg-base-300 rounded-lg shadow servers-list">
			<server v-for="item in rawKeys" :key="item.key" class="flex justify-between cursor-pointer pl-4 pr-8 py-2 hover:bg-base-250 gap-4">
				<div class="flex items-center gap-4">
					<div class="tooltip tooltip-right md:tooltip-left" data-tip="UP">
						<span class="block leading-[0]">
							<div class="status-indicator status-indicator--sm" :class="true ? 'status-indicator--success' : 'status-indicator--danger'">
								<div class="circle circle--animated circle-main" />
								<div class="circle circle--animated circle-secondary" />
								<div class="circle circle--animated circle-tertiary" />
							</div>
						</span>
					</div>
					<p>{{ item.hostname ?? trunk(item.host) ?? "waiting data..." }}</p>
				</div>
				<div class="flex items-center gap-4 text-gray-300">
					<span class="tooltip hidden md:block" data-tip="Collecting every 3 minutes">
						<div class="btn btn-square btn-ghost h-7 w-16 min-h-[1.75rem] normal-case font-normal flex flex-col gap-1 text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330.003 330.003" class="w-6 h-6">
								<path d="M328.417,208.293l-40-80c-2.541-5.082-7.735-8.292-13.417-8.292c-5.682,0-10.875,3.21-13.416,8.292l-44.868,89.735L158.98,69.565c-2.181-5.609-7.503-9.371-13.519-9.557c-6.006-0.173-11.559,3.243-14.081,8.708L75.402,190.001H15c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h70c5.851,0,11.168-3.402,13.619-8.714l45.201-97.934l57.2,147.085c2.15,5.53,7.358,9.273,13.285,9.547c0.233,0.011,0.466,0.016,0.699,0.016c5.659,0,10.864-3.194,13.413-8.292L275,168.542l26.584,53.167c3.705,7.41,12.716,10.414,20.124,6.708C329.118,224.713,332.121,215.703,328.417,208.293z" />
							</svg>
							3m
						</div>
					</span>
					<div class="dropdown dropdown-end">
						<label tabindex="0" class="btn btn-square btn-ghost h-7 w-10 min-h-[1.75rem]">
							<svg
								xmlns="http://www.w3.org/2000/svg" width="16" height="4" viewBox="0 0 16 4"
								fill="currentColor">
								<path d="M14 0C15.103 0 16 0.897 16 2C16 3.103 15.103 4 14 4C12.897 4 12 3.103 12 2C12 0.897 12.897 0 14 0ZM8 0C9.103 0 10 0.897 10 2C10 3.103 9.103 4 8 4C6.897 4 6 3.103 6 2C6 0.897 6.897 0 8 0ZM2 0C3.103 0 4 0.897 4 2C4 3.103 3.103 4 2 4C0.897 4 0 3.103 0 2C0 0.897 0.897 0 2 0Z" />
							</svg>
						</label>
						<div tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 bg-base-300 shadow rounded-box w-52 gap-1">
							<li><a>Configure</a></li>
							<li><a>Incidents</a></li>
							<div class="divider h-0 my-0" />
							<li><a>Delete</a></li>
						</div>
					</div>
				</div>
			</server>
		</div>
	</content>
</template>

<script>
import { nextTick, ref } from 'vue'

export default {
	name: 'Home',

	data () {
		return {
			// List of different Bertas hosted user's servers
			bertas: [],
			// List of owned keys by the user with info from Bertas.
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
						if (this.rawKeys.find((e) => e.key == elem.key) !== undefined) {
							return;
						}

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

				let bertaUrl = this.$bertaOverride ? this.$bertaOverride : "https://" + elem + ".speculare.cloud";
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
		generateKey: async function() {
			if (this.rawKeys.length >= 3) {
				this.$refs.mlt.checked = true;
				return;
			}

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