<template>
	<section>
		<div class="flex-col">
			<router-link key="servers" :to="{ name: 'Servers' }" class="btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3 !pl-0 !pr-2">
				<svg
					xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8" width="24" height="24"
					viewBox="0 0 24 24">
					<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
				</svg>
				<div class="flex flex-col items-start">
					<span class="text-base-content/50 hidden text-xs font-normal md:block">Prev</span>
					<span>Servers</span>
				</div>
			</router-link>
			<div class="prose-sm flex items-center gap-4 mt-4">
				<div class="status-indicator" :class="true ? 'status-indicator--success' : 'status-indicator--danger'">
					<div class="circle circle--animated circle-main" />
					<div class="circle circle--animated circle-secondary" />
					<div class="circle circle--animated circle-tertiary" />
				</div>
				<div class="flex flex-col align-middle gap-1">
					<h1 class="mb-0">
						{{ $route.params.hostname }}
					</h1>
					<p class="text-sm text-[#c5c8cb] my-0">
						<span class="text-green-400 mr-1">Up</span> - <span class="ml-1">Granularity of 3 seconds</span>
					</p>
				</div>
			</div>
		</div>
		<div class="mt-12">
			<div data-controller="resources--summary-interval" data-interval="30" data-url="/team/16377/monitors/359018/summary">
				<div class="flex flex-col md:flex-row md:space-x-4">
					<div class="flex flex-col align-middle justify-between mb-5 text-left flex-1 p-5 bg-base-300 shadow-md rounded-lg">
						<h6 class="text-[#c5c8cb] text-sm">
							Currently up for
						</h6>
						<h4 class="text-white text-lg">
							<span v-if="hostInfo">{{ fmtDuration(hostInfo.uptime) }}</span>
							<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-1" />
						</h4>
					</div>
					<div class="flex flex-col align-middle justify-between mb-5 text-left flex-1 p-5 bg-base-300 shadow-md rounded-lg">
						<h6 class="text-[#c5c8cb]">
							Last data at
						</h6>
						<h4 class="text-white  text-lg">
							<span v-if="hostInfo">1 second ago</span>
							<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-1" />
						</h4>
					</div>
					<div class="flex flex-col align-middle justify-between mb-5 text-left flex-1 p-5 bg-base-300 shadow-md rounded-lg">
						<h6 class="text-[#c5c8cb]">
							Incidents
						</h6>
						<h4 class="text-white text-lg">
							<span v-if="hostInfo">4</span>
							<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-1" />
						</h4>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { nextTick } from 'vue';
import { initWS, closeWS, CDC_VALUES } from '@/utils/websockets';
import { fmtDuration } from '@/utils/help';

export default {
	name: 'DetailsServer',

	setup () {
		return { fmtDuration }
	},

	data () {
		return {
			hostInfo: null,
			connection: null,
		}
	},

	mounted: function () {
		const vm = this

		// Don't setup anything before everything is rendered
		nextTick(async () => {
			const cdcUrl = this.$cdcOverride ? this.$cdcOverride : "wss://" + this.$route.params.berta + ".cdc.speculare.cloud";
			initWS(cdcUrl, "hosts", "update", ":uuid.eq." + this.$route.params.uuid, false, vm);
			await this.fetchInit();
		})
	},

	beforeUnmount: function () {
		// Close the webSocket connection
		closeWS("hosts", this);
	},

	methods: {
		convertToObject: function(jsonValues) {
			return {
				system: jsonValues[0],
				os_version: jsonValues[1],
				hostname: jsonValues[2],
				uptime: jsonValues[3],
				uuid: jsonValues[4],
				created_at: jsonValues[5],
			}
		},
		fetchInit: async function() {
			const bertaUrl = this.$bertaOverride ? this.$bertaOverride : "https://" + this.$route.params.berta + "server.speculare.cloud";
			await this.$http.get(bertaUrl + "/api/host?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.hostInfo = {
						system: resp.data.system,
						os_version: resp.data.os_version,
						hostname: resp.data.hostname,
						uptime: resp.data.uptime,
						uuid: resp.data.uuid,
						created_at: resp.data.created_at,
					};
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
		},
		// Function responsible to init the fetching data and the websocket connection
		wsMessageHandle: function (event) {
			const jsonValues = JSON.parse(event.data)[CDC_VALUES];
			this.hostInfo = {
				system: jsonValues[0],
				os_version: jsonValues[1],
				hostname: jsonValues[2],
				uptime: jsonValues[3],
				uuid: jsonValues[4],
				created_at: jsonValues[5],
			};
		}
	}
}
</script>