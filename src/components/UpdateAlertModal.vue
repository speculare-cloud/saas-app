<template>
	<label for="my-modal-4" class="modal modal-bottom sm:modal-middle cursor-pointer">
		<label class="modal-box relative flex flex-col gap-4" for="">
			<h3 class="text-lg font-bold">{{ alert.original.name }}</h3>

			<div class="flex flex-col gap-1">
				<p>Warning threshold:</p>
				<codemirror
					v-model="alertEditing.warn"
					placeholder="Enter the warning threshold (use $this to compare)"
					:indent-with-tab="true"
					:tab-size="4"
					:extensions="extensions"
					@ready="handleReady" />
			</div>

			<div class="flex flex-col gap-1">
				<p>Critical threshold:</p>
				<codemirror
					v-model="alertEditing.crit"
					placeholder="Enter the critical threshold (use $this to compare)"
					:indent-with-tab="true"
					:tab-size="4"
					:extensions="extensions"
					@ready="handleReady" />
			</div>

			<div class="modal-action justify-between mt-0">
				<label for="my-modal-4" class="btn btn-md" @click="$emit('close')">
					<svg
						class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
						viewBox="0 0 18 18">
						<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
					</svg>
				</label>
				<div class="flex flex-row gap-2">
					<button class="btn btn-md btn-info" @click="testAlert(self)">
						{{ testLoading ? 'loading...' : 'test' }}
					</button>
					<button class="btn btn-md btn-success" @click="updateAlert()" :disabled="applyDisabled">
						{{ updateLoading ? 'loading...' : 'apply' }}
					</button>
				</div>
			</div>

			<div v-if="alertContent" class="alert px-4 py-2 shadow-lg" :class="alertSuccess ? 'alert-success' : 'alert-error'">
				<code>{{ alertContent }}</code>
			</div>
		</label>
	</label>
</template>

<script lang="ts">
import { shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { rust } from '@codemirror/lang-rust'
import type { AlertsDTO } from '@martichou/sproot';
import { opt } from '@/utils/help';
import { testAlert } from '@/utils/alerts';

export default {
	name: 'UpdateAlertModal',

	components: {
		Codemirror,
	},

	emits: ['update:editing', 'update:alert', 'close'],

	props: {
		alert: {
			type: Object,
			required: true,
		},
	},

	setup() {
		const extensions = [rust(), oneDark]
		const view = shallowRef()
		const handleReady = (payload) => {
			view.value = payload.view
		}

		return { extensions, handleReady, testAlert };
	},

	data() {
		return {
			testLoading: false,
			updateLoading: false,

			alertSuccess: true,
			alertContent: opt<string>(),

			lastAlertTested: opt<AlertsDTO>(),
		}
	},

	computed: {
		applyDisabled() {
			return JSON.stringify(this.lastAlertTested) != JSON.stringify(this.alert.editing);
		},
		alertEditing: {
			get: function() {
				return this.alert.editing
			},
			set: function(value) {
				this.$emit('update:editing', value)
			}
		},
		editing() {
			return this.alert.editing;
		},
		self() {
			return this;
		}
	},

	methods: {
		updateAlert: async function() {
			if (this.updateLoading) return;
			this.updateLoading = true;

			// TODO - Make the update payload just the updated field
			const payload = { whole: this.alert.editing, update: this.alert.editing }
			await this.$http.patch(this.$serverBase(this.$route.params.berta as string) + "/api/alerts?id=" + this.alert.original.id, payload)
				.then((resp) => {
					this.$emit('update:alert', resp.data);

					this.alertContent = "alert successfully updated";
					this.alertSuccess = true;
				}).catch((err) => {
					console.error(err);
					this.alertContent = "error: " + err.request.response ?? err.message;
					this.alertSuccess = false;
				});

			this.updateLoading = false;
		},
	}
}
</script>

<style scoped>
code {
	background-color: transparent;
}
</style>