<template>
	<div>
		<input ref="refreshModal" type="checkbox" :id="'refresh-modal-' + trunkKey" class="modal-toggle">
		<div class="modal modal-bottom sm:modal-middle">
			<div class="modal-box relative">
				<label :for="'refresh-modal-' + trunkKey" class="btn btn-sm lg:btn-md btn-circle absolute right-2 top-2">✕</label>
				<h3 class="font-bold text-lg">
					Are you really sure?
				</h3>
				<p class="pt-6">
					Once you'll submit this query, a new key will be generated and the old one will be revoked.
				</p>
				<p class="mt-2">
					Until you update the key on the targeted server, he won't be able to push any new metrics.
				</p>
				<div class="form-control w-full pt-2">
					<label class="label px-0">
						<span class="label-text">Enter <span class="badge badge-info">{{ trunkKey }}</span> to confirm</span>
					</label>
					<input type="text" placeholder="Type here" class="input input-bordered input-info w-full" style="font-size: 1rem;">
				</div>
				<div class="modal-action">
					<label :for="'refresh-modal-' + trunkKey" class="btn btn-sm lg:btn-md lowercase">cancel</label>
					<label @click="refreshKey" class="btn btn-sm lg:btn-md btn-info lowercase">refresh</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		trunkKey: {
			type: String,
			required: true
		}
	},

	methods: {
		refreshKey: function() {
			console.log("Asked for refresh")
			this.$refs.refreshModal.checked = false;
		},
	}
}
</script>