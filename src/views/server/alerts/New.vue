<template>
	<section>
		<div class="flex-col">
			<router-link
				:to="{ name: 'AlertsServer', params: { berta: $route.params.berta, uuid: $route.params.uuid, hostname: $route.params.hostname } }"
				class="btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3 !pl-0 !pr-2">
				<svg
					xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8" width="24" height="24"
					viewBox="0 0 24 24">
					<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
				</svg>
				<div class="flex flex-col items-start">
					<span class="text-base-content hidden text-xs font-normal md:block">Prev</span>
					<span class="text-white">Alerts of {{ $route.params.hostname }}</span>
				</div>
			</router-link>
			<div class="prose-sm flex items-center gap-4 mt-4">
				<div class="flex flex-col align-middle gap-1">
					<h1 class="mb-0">
						Create a new alert
					</h1>
				</div>
			</div>
		</div>
		<div class="mt-12 mb-12">
			<div class="flex flex-col xl:flex-row xl:space-x-20 space-y-8 xl:space-y-0">
				<div class="flex-1 prose-sm xl:flex flex-col align-middle pt-10">
					<h3>Define your alert details</h3>
					<p class="mt-3 text-[#c5c8cb] text-sm">
						The first step is to define your alert details, such as the targeted metrics, etc.
					</p>
				</div>
				<div class="flex-2 flex flex-col gap-4 bg-base-300 rounded-lg shadow px-6 py-8">
					<div class="form-control">
						<label class="label">
							<span class="label-text">Name of the Alert</span>
						</label>
						<input
							v-model="alert.name" type="text" placeholder="what.ever.name.you.want"
							class="input input-bordered w-full h-10 form-control-custom focus:outline-none">
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Description of the Alert (opt)</span>
						</label>
						<input
							v-model="alert.info" type="text" placeholder="enter a small description (optional)"
							class="input input-bordered w-full h-10 form-control-custom focus:outline-none">
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Which metric</span>
						</label>
						<input
							v-model="alert.table" type="text" placeholder="enter which metric"
							class="input input-bordered w-full h-10 form-control-custom focus:outline-none">
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Lookup query</span>
						</label>
						<input
							v-model="alert.lookup" type="text" placeholder="enter your lookup query"
							class="input input-bordered w-full h-10 form-control-custom focus:outline-none">
						<label class="label flex-col items-start">
							<span class="label-text">↪ [aggr] [mode] [timeframe] of [table] {over} {table}</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Timing</span>
						</label>
						<input
							v-model="alert.timing" type="number" placeholder="how often to run (in s)"
							class="input input-bordered w-full h-10 form-control-custom focus:outline-none">
					</div>

					<div class="flex flex-col gap-1">
						<label class="label">
							<span class="label-text">Warning threshold</span>
						</label>
						<codemirror
							v-model="alert.warn"
							placeholder="Enter the warning threshold (use $this to compare)"
							:indent-with-tab="true"
							:tab-size="4"
							:extensions="extensions"
							@ready="handleReady" />
					</div>

					<div class="flex flex-col gap-1">
						<label class="label">
							<span class="label-text">Critical threshold</span>
						</label>
						<codemirror
							v-model="alert.crit"
							placeholder="Enter the critical threshold (use $this to compare)"
							:indent-with-tab="true"
							:tab-size="4"
							:extensions="extensions"
							@ready="handleReady" />
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Additional WHERE (opt)</span>
						</label>
						<input
							v-model="alert.where_clause" type="text" placeholder="WHERE clause to be added (optional)"
							class="input input-bordered w-full h-10 form-control-custom focus:outline-none">
					</div>

					<p class="mt-2 text-[#c5c8cb] text-sm">
						If you need more information about how to create an alert, check <a href="#" class="underline font-medium">here</a>.
					</p>
				</div>
			</div>

			<div class="divider my-12">
				then
			</div>

			<div class="flex flex-col md:flex-row md:space-x-20 space-y-8 md:space-y-0">
				<div class="flex-1 bg-base-300 rounded-lg shadow px-6 py-8">
					<button class="btn btn-md btn-info w-full" @click="testAlert(self)">
						{{ testLoading ? 'loading...' : 'test' }}
					</button>
					<p class="mt-2 px-4 py-2 text-[#c5c8cb]" v-if="!alertContent">
						↪
						<span>the return will be displayed here once the test conclude</span>
					</p>
					<div v-if="alertContent" class="mt-2 alert px-4 py-2 shadow-lg" :class="alertSuccess ? 'alert-success' : 'alert-error'">
						<code>{{ alertContent }}</code>
					</div>
				</div>
				<div class="flex-2 prose-sm md:flex flex-col justify-center align-middle">
					<h3>You need to test your Alert</h3>
					<p class="mt-3 text-[#c5c8cb] text-sm">
						You now need to test if the Alert is triggering any errors or is returning the expected result.
					</p>
				</div>
			</div>

			<div class="divider my-12">
				finally
			</div>

			<div class="max-w-lg mx-auto flex flex-col justify-center gap-6">
				<div class="prose-sm rounded-lg shadow px-4 py-6" :class="!validated ? 'bg-neutral bg-opacity-20' : 'bg-base-300'">
					<h3 class="font-semibold" :class="!validated ? 'text-base-content text-opacity-20' : ''">
						You're all set
					</h3>
					<p class="mt-3 text-sm" :class="!validated ? 'text-base-content text-opacity-20' : 'text-[#c5c8cb]'">
						The Alert is ready to be started! It passed the validation and did not produce any unexpected
						output. But don't worry, you'll be able to modify it later on if you want.
					</p>
				</div>
				<div class="w-full">
					<button
						v-if="!alertSaveSuccess" :disabled="!validated" class="btn btn-md btn-success w-full" key="add_server"
						@click="saveAlert()">
						{{ saveLoading ? 'loading...' : 'save alert' }}
					</button>
					<router-link
						class="btn btn-md btn-info w-full" v-if="alertSaveSuccess"
						:to="{ name: 'AlertsServer', params: { berta: $route.params.berta, uuid: $route.params.uuid, hostname: $route.params.hostname } }">
						go back
					</router-link>
					<div v-if="alertSaveContent" class="mt-2 alert px-4 py-2 shadow-lg" :class="alertSaveSuccess ? 'alert-success' : 'alert-error'">
						<code>{{ alertSaveContent }}</code>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { rust } from '@codemirror/lang-rust'
import type { AlertsDTO } from '@martichou/sproot';
import { opt, optUn } from '@/utils/help';
import { testAlert } from '@/utils/alerts';

export default {
	name: 'NewAlert',

	components: {
		Codemirror,
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
			saveLoading: false,

			// Used to display the result of the test
			alertSuccess: true,
			alertContent: opt<string>(),

			// Used to display error when saving alert
			alertSaveContent: opt<string>(),
			alertSaveSuccess: false,

			lastAlertTested: opt<AlertsDTO>(),

			alert: {
				name: optUn<string>(),
				table: optUn<string>(),
				lookup: optUn<string>(),
				timing: 60,
				warn: "$this > your.warn.value",
				crit: "$this > your.crit.value",
				info: optUn<string>(),
				where_clause: optUn<string>(),
			},
		}
	},

	computed: {
		validated() {
			return JSON.stringify(this.lastAlertTested) === JSON.stringify(this.editing);
		},
		editing() {
			return {
				...this.alert,
				active: true,
				host_uuid: this.$route.params.uuid,
				cid: this.$mainStore.userId,
				hostname: this.$route.params.hostname
			} as AlertsDTO;
		},
		self() {
			return this;
		}
	},

	methods: {
		saveAlert: async function() {
			if (this.saveLoading) return;
			this.saveLoading = true;

			await this.$http.post(this.$serverBase(this.$route.params.berta as string) + "/api/alerts", this.editing)
				.then((resp) => {
					console.log("Alert saved success:", resp);
					this.alertSaveContent = "alert successfully saved";
					this.alertSaveSuccess = true;
				}).catch((err) => {
					console.error(err);
					this.alertSaveContent = "error: " + err.request.response ?? err.message;
					this.alertSaveSuccess = false;
				});

			this.saveLoading = false;
		},
	}
}
</script>

<style scoped lang="css">
.mockup-code:before {
	display: none;
}

.mockup-code {
	@apply px-2 py-2;
}

code {
	background-color: transparent;
}
</style>