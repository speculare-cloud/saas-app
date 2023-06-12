<template>
	<label for="my-modal-5" class="modal modal-bottom sm:modal-middle cursor-pointer">
		<label class="modal-box relative flex flex-col gap-4" for="">
			<h3 class="text-lg font-bold">{{ alert.name }}</h3>
			<p>Duplicate this alert to others servers by selecting the targeted servers in the list below.</p>

			<div class="overflow-y-auto scroll-bg-base max-h-72 grid grid-cols-1 md:grid-cols-2 gap-4">
				<label
					v-for="s in $serversStore.configuredKeys.filter((el) => el.host.uuid !== $route.params.uuid)" :key="s.host.uuid" :for="'s-' + s.host.uuid"
					class="py-3 px-4 border rounded-lg flex flex-row items-center border-gray-500 border-opacity-25 gap-4 cursor-pointer hover:bg-white hover:bg-opacity-5">
					<input
						:id="'s-' + s.host.uuid" type="checkbox" :checked="isChecked(s)" class="checkbox checkbox-sm"
						@change="inputChange($event, s)">
					<p>{{ s.host.hostname }}</p>
				</label>
			</div>

			<div class="modal-action justify-between mt-0">
				<label for="my-modal-5" class="btn btn-md" @click="$emit('close')">
					<svg
						class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
						viewBox="0 0 18 18">
						<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
					</svg>
				</label>
				<button class="btn btn-md btn-success" @click="duplicateAlert()" :disabled="toDuplicate.length === 0">
					{{ duplicateLoading ? 'loading...' : 'apply' }}
				</button>
			</div>
		</label>
	</label>
</template>

<script lang="ts">
import type { ConfiguredKeys } from '@/types/ConfiguredKeys';
import type { DupAlert } from '@/types/DuplicateAlert';
import { performTest } from '@/utils/alerts';
import type { AlertsDTO } from '@martichou/sproot';
import type { PropType } from 'vue';

export default {
	name: 'DuplicateAlertModal',

	emits: ['close'],

	props: {
		alert: {
			type: Object as PropType<AlertsDTO>,
			required: true
		},
	},

	data() {
		return {
			testLoading: false,
			duplicateLoading: false,

			toDuplicate: new Array<DupAlert>,
		}
	},

	computed: {
		self() {
			return this;
		}
	},

	methods: {
		isChecked: function(h: ConfiguredKeys) {
			return this.toDuplicate.findIndex((el) => el.a.host_uuid === h.host.uuid) !== -1;
		},
		inputChange: function(change, h: ConfiguredKeys) {
			if (change.target.checked) {
				this.addToDuplicate(h)
			} else {
				this.removeFromDuplicate(h)
			}
		},
		addToDuplicate: function(h: ConfiguredKeys) {
			const idx = this.toDuplicate.findIndex((el) => el.a.host_uuid === h.host.uuid);
			if (idx !== -1) return;

			this.toDuplicate.push({
				k: h,
				a: {
					...this.alert,
					host_uuid: h.host.uuid,
					hostname: h.host.hostname
				},
			});
		},
		removeFromDuplicate: function(h: ConfiguredKeys) {
			const idx = this.toDuplicate.findIndex((el) => el.a.host_uuid === h.host.uuid);
			if (idx !== -1) this.toDuplicate.splice(idx, 1);
		},
		duplicateAlert: async function() {
			if (this.duplicateLoading) return;

			// For each element inside toDuplicate
			// 1. Test it against the test endpoint
			// 2. Save it into the servers
			await this.toDuplicate.map(async (el) => {
				await performTest(this, el.k.key.berta, el.a, async () => {
					// Save the alert into the DB
					await this.$http.post(this.$serverBase(el.k.key.berta) + "/api/alerts", el.a)
						.then((resp) => {
							console.log("Alert saved success:", resp);
						}).catch((err) => {
							console.error("post: err:", err);
						});
				}, (err) => {
					// TODO
					console.error("performTest: err", err)
				});
				return;
			});

			this.duplicateLoading = false;
		},
	}
}
</script>