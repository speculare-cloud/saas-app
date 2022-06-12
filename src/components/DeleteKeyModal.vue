<template>
	<div>
		<input ref="deleteModal" type="checkbox" :id="'delete-modal-' + trunkKey" class="modal-toggle">
		<div class="modal modal-bottom sm:modal-middle">
			<div class="modal-box relative">
				<label :for="'delete-modal-' + trunkKey" class="btn btn-sm lg:btn-md btn-circle absolute right-2 top-2">✕</label>
				<h3 class="font-bold text-lg">
					Are you really sure?
				</h3>
				<p class="pt-6">
					You won't be able to use the key thereafter, meaning that the host using it will be denied pushing new data.
				</p>
				<div class="form-control w-full pt-2">
					<label class="label px-0 select-text">
						<span class="label-text">Enter <span class="badge badge-error">{{ trunkKey }}</span> to confirm</span>
					</label>
					<input
						v-model="inputKey" type="text" placeholder="Type here"
						class="input input-bordered input-error w-full" style="font-size: 1rem;">
				</div>
				<div class="modal-action">
					<label :for="'delete-modal-' + trunkKey" class="btn btn-sm lg:btn-md lowercase">cancel</label>
					<label @click="deleteKey" class="btn btn-sm lg:btn-md btn-error lowercase">
						<span v-if="!loading">delete</span>
						<span v-if="loading">loading...</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useServersStore } from '@/stores/servers';

export default {
	props: {
		trunkKey: {
			type: String,
			required: true
		},
		fullKey: {
			type: String,
			required: true
		}
	},

	setup () {
		const store = useServersStore();
		return { store }
	},

	data () {
		return {
			inputKey: null,
			loading: false,
		}
	},

	methods: {
		deleteKey: async function() {
			if (this.inputKey === this.trunkKey && !this.loading) {
				this.loading = true;

				await this.$http.delete(this.$authBase + "/api/key", { headers: { "SPTK": this.fullKey } })
					.then(() => {
						// Get the index of the key in configuredKeys
						const indexC = this.store.configuredKeys.findIndex((el) => el.key == this.fullKey);
						// If present here, remove it
						if (indexC !== -1) {
							this.store.configuredKeys.splice(indexC, 1);
							return;
						}

						// Get the index of the key in unconfiguredKeys
						const indexU = this.store.unconfiguredKeys.findIndex((el) => el.key == this.fullKey);
						// If present here, remove it
						if (indexU !== -1) {
							this.store.unconfiguredKeys.splice(indexU, 1);
							return;
						}

						this.$refs.deleteModal.checked = false;
					}).catch((err) => {
						// TODO - Handle errors
						console.log(err);
						this.loading = false;
					});
			}
		},
	}
}
</script>