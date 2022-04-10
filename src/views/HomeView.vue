<template>
	<div class="flex-1">
		<div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8 sm:h-11">
			<h3 class="text-2xl">
				Have a great day!
			</h3>
			<div class="indicator">
				<span v-if="rawKeys.length == 0" class="indicator-item indicator-end sm:indicator-start badge badge-primary" />
				<button @click="generateKey" class="btn bg-neutral btn-sm lg:btn-md lowercase">
					Add new
				</button>
			</div>
		</div>

		<div v-if="rawKeys.length == 0" class="bg-neutral text-neutral-content shadow-xl rounded-box mb-2" style="height: 60px;">
			<div class="card-body justify-center items-center align-middle text-center p-3 h-full">
				<p class="flex-none flex justify-center">
					Generate your first key with the <span class="badge badge-primary mx-1" /> annotated button!
				</p>
			</div>
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
				<div v-if="!item.host" class="alert shadow-lg p-3 text-sm">
					<div>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						<span>No data received yet... is this host configured correctly?</span>
					</div>
				</div>
				<div class="form-control" :class="!item.host ? 'mt-2': ''">
					<label class="label">
						<span class="label-text">Secret key</span>
					</label>
					<label class="input-group">
						<input
							v-if="item.show" :value="item.key" type="text" class="input input-bordered w-full focus:outline-none h-8 lg:h-12"
							readonly>
						<input
							v-else type="password" :value="item.key" class="input input-bordered w-full focus:outline-none text-3xl h-8 lg:h-12"
							readonly>
						<button class="btn btn-primary btn-sm lg:btn-md text-sm lowercase" @click="toggleShow(item)">
							<p v-if="item.show">hide</p>
							<p v-else>show</p>
						</button>
					</label>
				</div>
				<div class="flex justify-between sm:justify-start mt-4 gap-4">
					<label :for="'refresh-modal-' + trunk(item.key)" class="btn btn-info lowercase btn-sm lg:btn-md">
						refresh key
					</label>
					<label :for="'delete-modal-' + trunk(item.key)" class="btn btn-error modal-button lowercase btn-sm lg:btn-md">
						delete key
					</label>
				</div>
				<!-- Item's modals (delete/refresh) -->
				<RefreshKeyModal :trunk-key="trunk(item.key)" />
				<DeleteKeyModal :trunk-key="trunk(item.key)" />
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

		<!-- Modals -->
		<input ref="mlt" type="checkbox" id="modal-limit" class="modal-toggle">
		<div class="modal modal-bottom sm:modal-middle">
			<div class="modal-box relative">
				<label for="modal-limit" class="btn btn-sm lg:btn-md btn-circle absolute right-2 top-2">✕</label>
				<h3 class="font-bold text-lg">
					You've reached the limit of your plan
				</h3>
				<p class="pt-6">
					Unfortunately you cannot create a new key because you've already filled your limits of keys.
				</p>
				<p class="mt-2">
					You can however upgrade for another plan if you'd like.
				</p>
				<div class="modal-action">
					<label for="modal-limit" class="btn btn-sm lg:btn-md lowercase">cancel</label>
					<label for="modal-limit" class="btn btn-sm lg:btn-md btn-primary lowercase">upgrade</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { nextTick, ref } from 'vue'
import DeleteKeyModal from '@/components/DeleteKeyModal'
import RefreshKeyModal from '@/components/RefreshKeyModal'

export default {
	name: 'Home',
	components: {
		DeleteKeyModal,
		RefreshKeyModal
	},

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

		// TODO - WebSocket ?
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
		toggleShow: function(item) {
			item.show = !item.show;
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