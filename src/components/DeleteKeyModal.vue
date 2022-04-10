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
					<label class="label px-0">
						<span class="label-text">Enter <span class="badge badge-error">{{ trunkKey }}</span> to confirm</span>
					</label>
					<input type="text" placeholder="Type here" class="input input-bordered input-error w-full" style="font-size: 1rem;">
				</div>
				<div class="modal-action">
					<label :for="'delete-modal-' + trunkKey" class="btn btn-sm lg:btn-md lowercase">cancel</label>
					<label @click="deleteKey" class="btn btn-sm lg:btn-md btn-error lowercase">delete</label>
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
		deleteKey: function() {
			console.log("Asked for deletion")
			this.$refs.deleteModal.checked = false;
		},
	}
}
</script>