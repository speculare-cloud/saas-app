<template>
	<section>
		<div class="flex-col">
			<router-link key="servers" :to="{ name: 'Servers' }" class="btn btn-md btn-ghost gap-2 normal-case lg:gap-3 !pl-0 !pr-2">
				<svg
					xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8" width="24" height="24"
					viewBox="0 0 24 24">
					<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
				</svg>
				<div class="flex flex-col items-start">
					<span class="text-base-content hidden text-xs font-normal md:block">Prev</span>
					<span class="text-white">Servers</span>
				</div>
			</router-link>
			<div class="prose-sm flex items-center gap-4 mt-4">
				<div class="status-indicator" :class="isServerOnline(hostInfo?.updated_at) == 2 ? 'status-indicator--success' : isServerOnline(hostInfo?.updated_at) == 1 ? 'status-indicator--warning' : 'status-indicator--danger'">
					<div class="circle circle--animated circle-main" />
					<div class="circle circle--animated circle-secondary" />
					<div class="circle circle--animated circle-tertiary" />
				</div>
				<div class="flex flex-col align-middle gap-1">
					<h1 class="mb-0">
						{{ $route.params.hostname }}
					</h1>
					<p class="text-sm text-[#c5c8cb] my-0">
						<span v-if="isServerOnline(hostInfo?.updated_at) == 2" class="text-success mr-1">Up</span>
						<span v-else-if="isServerOnline(hostInfo?.updated_at) == 1" class="text-warning mr-1">??</span>
						<span v-else class="text-error mr-1">Down</span>
						-
						<span class="ml-1">Granularity of {{ fmtGranularity(granularity ?? 0) }}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="mt-12">
			<div class="flex flex-col md:flex-row md:space-x-4">
				<div class="flex-[2_2_0%] grid grid-cols-2 gap-4 mb-5">
					<div class="flex flex-row items-center justify-between text-left p-5 bg-base-300 shadow-md rounded-lg">
						<div class="flex flex-col w-full h-full justify-around">
							<h6 class="text-[#c5c8cb]">
								Currently up for
							</h6>
							<h4 class="text-white text-lg mt-2 flex flex-row gap-2 min-h-[34px]">
								<span v-if="hostInfo">{{ fmtDuration(hostInfo.uptime) }}</span>
								<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-3" />
							</h4>
						</div>
					</div>
					<div class="flex flex-row items-center justify-between text-left p-5 bg-base-300 shadow-md rounded-lg">
						<div class="flex flex-col w-full h-full justify-around">
							<h6 class="text-[#c5c8cb]">
								Incidents
							</h6>
							<h4 class="text-white text-lg mt-2 flex flex-row gap-2 min-h-[34px]">
								<span v-if="hostInfo">{{ incidentsCount?.total ?? 0 }}<span v-if="(incidentsCount?.total ?? 0) >= 100">+</span></span>
								<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-3" />
							</h4>
						</div>
						<router-link key="incidentsServer" :to="{ name: 'IncidentsServer' }" class="text-[#c5c8cb]">
							<svg
								xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8 rotate-180 hover:!fill-white transition duration-300" width="24" height="24"
								viewBox="0 0 24 24">
								<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
							</svg>
						</router-link>
					</div>
				</div>
				<div class="flex-1 flex flex-row items-center justify-between mb-5 text-left p-5 bg-base-300 shadow-md rounded-lg gap-2">
					<div class="flex flex-col w-full h-full justify-around">
						<h6 class="text-[#c5c8cb]">
							Alerts
						</h6>
						<h4 class="text-white mt-2 flex flex-row gap-2 min-h-[34px]">
							<span v-if="hostInfo" class="badge badge-success bg-opacity-[15%] p-4 text-white text-[15px] w-full text-ellipsis whitespace-nowrap">
								{{ alertsCount?.active ?? 0 }} {{ (alertsCount?.active ?? 0) > 1 ? 'actives' : 'active' }}
							</span>
							<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-3" />

							<span v-if="hostInfo" class="badge badge-error bg-opacity-[15%] p-4 text-white text-[15px] w-full text-ellipsis whitespace-nowrap">
								{{ alertsCount?.inactive ?? 0 }} {{ (alertsCount?.inactive ?? 0) > 1 ? 'inactives' : 'inactive' }}
							</span>
							<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-3" />
						</h4>
					</div>
					<router-link key="alerts" :to="{ name: 'AlertsServer' }" class="text-[#c5c8cb]">
						<svg
							xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8 rotate-180 hover:!fill-white transition duration-300" width="24" height="24"
							viewBox="0 0 24 24">
							<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
						</svg>
					</router-link>
				</div>
			</div>
		</div>
		<div role="section" class="mt-4">
			<h3 class="text-2xl text-gray-100 mb-4" id="cputimes">
				cpu
			</h3>
			<p class="text-sm text-gray-200">
				Total CPU utilization. 100% here means there is no CPU idle time at all.
			</p>
			<CpuTimes :key="$route.params.uuid as string" :uuid="$route.params.uuid as string" :berta="$route.params.berta as string" :graph-range="graphRange" />
			<h3 class="text-2xl text-gray-100 mb-4 mt-4" id="loadavg">
				load
			</h3>
			<p class="text-sm text-gray-200">
				System load. The 3 metrics refer to 1, 5 and 15 minutes averages. Computed once every 5 seconds.
			</p>
			<LoadAvg :key="$route.params.uuid as string" :uuid="$route.params.uuid as string" :berta="$route.params.berta as string" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4">
			<h3 class="text-2xl text-gray-100 mb-4" id="ioblocks">
				disks
			</h3>
			<p class="text-sm text-gray-200">
				Total Disk I/O for all physical disks. Physical are disks present in <code>/sys/block</code> but don't have a <code>{}/device</code> in it.
			</p>
			<IoBlocksOverall :key="$route.params.uuid as string" :uuid="$route.params.uuid as string" :berta="$route.params.berta as string" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4">
			<h3 class="text-2xl text-gray-100 mb-4" id="ram">
				ram
			</h3>
			<p class="text-sm text-gray-200">
				System Random Access Memory (i.e. physical memory) usage.
			</p>
			<Ram :key="$route.params.uuid as string" :uuid="$route.params.uuid as string" :berta="$route.params.berta as string" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4">
			<h3 class="text-2xl text-gray-100 mb-4" id="swap">
				swap
			</h3>
			<p class="text-sm text-gray-200">
				System swap memory usage. Swap space is used when the RAM if full.
			</p>
			<Swap :key="$route.params.uuid as string" :uuid="$route.params.uuid as string" :berta="$route.params.berta as string" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4 mb-16">
			<h3 class="text-2xl text-gray-100 mb-4" id="ionets">
				network
			</h3>
			<p class="text-sm text-gray-200">
				Total bandwidth of all physical network interfaces. Physical are all the network interfaces that are listed in <code>/proc/net/dev</code>, but do not exist in <code>/sys/devices/virtual/net</code>.
			</p>
			<IoNetsOverall :key="$route.params.uuid as string" :uuid="$route.params.uuid as string" :berta="$route.params.berta as string" :graph-range="graphRange" />
		</div>

		<label for="my-modal-6" class="btn btn-md bg-success fixed bottom-8 right-8 text-black hover:text-white">
			<svg
				xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"
				class="w-6 h-6 inline-block fill-current">
				<path d="M700 926q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q733 866 756.5 842.735q23.5-23.264 23.5-56.5Q780 753 756.735 729.5q-23.264-23.5-56.5-23.5Q667 706 643.5 729.265q-23.5 23.264-23.5 56.5Q620 819 643.265 842.5q23.264 23.5 56.5 23.5ZM120 816v-60h360v60H120Zm140-310q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q293 446 316.5 422.735q23.5-23.264 23.5-56.5Q340 333 316.735 309.5q-23.264-23.5-56.5-23.5Q227 286 203.5 309.265q-23.5 23.264-23.5 56.5Q180 399 203.265 422.5q23.264 23.5 56.5 23.5ZM480 396v-60h360v60H480Z" />
			</svg>
		</label>

		<input type="checkbox" id="my-modal-6" class="modal-toggle">
		<label for="my-modal-6" class="modal modal-bottom sm:modal-middle cursor-pointer">
			<label for="" class="modal-box overscroll-none overflow-y-initial">
				<!-- Body -->
				<h3 class="text-lg font-bold mb-2">Quick selector</h3>
				<select class="form-select block w-full py-1 mb-6" ref="scaleSelect">
					<option />
					<option :selected="selectedIdx == 1">
						Last 5 minutes (realtime data)
					</option>
					<option :selected="selectedIdx == 2">
						Last 15 minutes
					</option>
					<option :selected="selectedIdx == 3">
						Last 30 minutes
					</option>
					<option :selected="selectedIdx == 4">
						Last 1 hour
					</option>
					<option :selected="selectedIdx == 5">
						Last 3 hours
					</option>
					<option :selected="selectedIdx == 6">
						Last 6 hours
					</option>
				</select>
				<h3 class="text-lg font-bold mb-2">Range selector</h3>
				<DatePicker v-model.range.string="range" :masks="{ input: 'MMMM D, YYYY', modelValue: 'YYYY-MM-DD' }" :max-date="tomorrow" color="blue">
					<template #default="{ inputValue, isDragging, togglePopover }">
						<div class="flex flex-col sm:flex-row justify-start items-center">
							<div class="relative flex-grow w-full">
								<svg
									class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
									fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									viewBox="0 0 24 24" stroke="currentColor">
									<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<input
									class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
									:class="isDragging ? 'text-gray-600' : 'text-gray-900'"
									:value="inputValue.start" @click="togglePopover()" placeholder="Click to select">
							</div>
							<span class="flex-shrink-0 m-2 text-white">
								<svg class="rotate-90 sm:rotate-0 w-4 h-4 stroke-current" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</span>
							<div class="relative flex-grow w-full">
								<svg
									class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
									fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									viewBox="0 0 24 24" stroke="currentColor">
									<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<input
									class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
									:class="isDragging ? 'text-gray-600' : 'text-gray-900'"
									:value="inputValue.end" @click="togglePopover()" placeholder="Click to select">
							</div>
						</div>
					</template>
				</DatePicker>

				<!-- Footer -->
				<div class="modal-action justify-between mt-6">
					<label for="my-modal-6" class="btn btn-md">
						<svg
							class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
							viewBox="0 0 18 18">
							<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
						</svg>
					</label>
					<div class="flex flex-row gap-2">
						<button class="btn btn-md" @click="resetGraphRange()">
							Clear
						</button>
						<button class="btn btn-md btn-success" @click="applyRangeSelect()">
							Apply
						</button>
					</div>
				</div>
			</label>
		</label>
	</section>
</template>

<script lang="ts">
import Skeleton from '@/components/Graphs/Base/Skeleton.vue'

import { DatePicker } from 'v-calendar'
import { useServersStore } from '@/stores/servers';
import { nextTick , defineAsyncComponent } from 'vue';
import { initWS, closeWS } from '@/utils/websockets';
import { fmtGranularity, computeGranularity, opt } from '@/utils/help';
import type { Host, HttpAlertsCount, HttpIncidentsCount } from '@martichou/sproot';
import { DateTime } from 'luxon';
import { fmtDuration, isServerOnline } from '@/utils/time';

import 'v-calendar/dist/style.css';

const scaleIdxArr = [5, 15, 30, 60, 180, 360]

export default {
	name: 'DetailsServer',

	components: {
		DatePicker,
		CpuTimes: defineAsyncComponent({
			loader: () => import('@/components/Graphs/cpu/CpuTimes.vue'),
			loadingComponent: Skeleton
		}),
		LoadAvg: defineAsyncComponent({
			loader: () => import('@/components/Graphs/cpu/LoadAvg.vue'),
			loadingComponent: Skeleton
		}),
		IoBlocksOverall: defineAsyncComponent({
			loader: () => import('@/components/Graphs/disks/IoBlocksOverall.vue'),
			loadingComponent: Skeleton
		}),
		Ram: defineAsyncComponent({
			loader: () => import('@/components/Graphs/memory/Ram.vue'),
			loadingComponent: Skeleton
		}),
		Swap: defineAsyncComponent({
			loader: () => import('@/components/Graphs/memory/Swap.vue'),
			loadingComponent: Skeleton
		}),
		IoNetsOverall: defineAsyncComponent({
			loader: () => import('@/components/Graphs/net/IoNetsOverall.vue'),
			loadingComponent: Skeleton
		})
	},

	setup () {
		const store = useServersStore();
		return { store, fmtDuration, isServerOnline, fmtGranularity }
	},

	computed: {
		tomorrow() {
			const date = new Date();
			date.setDate(date.getDate() + 1);
			return date;
		},
	},

	data () {
		return {
			selectedIdx: 1,
			range: {
				start: opt<string>(),
				end: opt<string>(),
			},
			graphRange: {
				granularity: 1,
				scale: 300,
				start: opt<DateTime>(),
				end: opt<DateTime>()
			},
			alertsCount: opt<HttpAlertsCount>(),
			hostInfo: opt<Host>(),
			connection: null,
			incidentsCount: opt<HttpIncidentsCount>(),
			granularity: opt<number>(),
		}
	},

	mounted: function () {
		// Don't setup anything before everything is rendered
		nextTick(async () => {
			initWS({
				vm: this,
				wsUrl: this.$cdcBase(this.$route.params.berta as string),
				table: "hosts",
				eventType: "update",
				filter: ":uuid.eq." + this.$route.params.uuid,
			});
			await this.fetchInit();

			// The first few attempts can fails because the Base.vue WS may not have
			// already had the time to fetch all hosts/servers info.
			let retry = 0;
			do {
				const rkey = this.store.configuredKeys.find((obj) => obj.host.uuid === this.$route.params.uuid);
				if (rkey !== undefined) {
					this.granularity = 3000;
					break;
				}
				retry += 1;
				await new Promise(r => setTimeout(r, 150));
			}
			while (retry <= 5);
		})
	},

	beforeUnmount: function () {
		// Close the webSocket connection
		closeWS("hosts", this);
	},

	methods: {
		resetGraphRange: function() {
			(this.$refs.scaleSelect as any).selectedIndex = 1;
			this.graphRange = {
				granularity: 1,
				scale: 300,
				start: null,
				end: null
			}

			this.range = {
				start: null,
				end: null
			}
		},
		applyRangeSelect: function() {
			if (this.range.start && this.range.end) {
				const start = DateTime.fromISO(this.range.start);
				const end = DateTime.fromISO(this.range.end);
				// Assume the scale will never be bigger than 1 info per seconds
				this.graphRange = {
					granularity: computeGranularity(end.diff(start).as('seconds')),
					scale: end.diff(start).as('seconds'),
					start: start,
					end: end
				}
			} else {
				const scaleIdx = (this.$refs.scaleSelect as any).selectedIndex;
				if (scaleIdx === 0) return;

				this.selectedIdx = scaleIdx;
				this.graphRange = {
					granularity: computeGranularity(scaleIdxArr[scaleIdx - 1] * 60),
					scale: scaleIdxArr[scaleIdx - 1] * 60,
					start: null,
					end: null
				}
			}
			console.log("Computed granularity is:", this.graphRange.granularity);
		},
		fetchInit: async function() {
			await this.$http.get(this.$serverBase(this.$route.params.berta as string) + "/api/host?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.hostInfo = resp.data as Host;
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
			await this.$http.get(this.$serverBase(this.$route.params.berta as string) + "/api/incidents/count?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.incidentsCount = resp.data as HttpIncidentsCount;
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
			await this.$http.get(this.$serverBase(this.$route.params.berta as string) + "/api/alerts/count?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.alertsCount = resp.data as HttpAlertsCount;
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
		},
		// Function responsible to init the fetching data and the websocket connection
		wsMessageHandle: function (event) {
			const json = JSON.parse(event.data);
			const columnsNames = json.columnnames;
			const columnsValues = json.columnvalues;

			this.hostInfo = Object.fromEntries(
				columnsNames.map((_, i) => [columnsNames[i], columnsValues[i]])
			) as Host;
		}
	}
}
</script>