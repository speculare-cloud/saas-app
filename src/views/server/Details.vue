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
						<span class="ml-1">Granularity of {{ fmtGranularity(granularity) }}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="mt-12">
			<div class="flex flex-col md:flex-row md:space-x-4">
				<div class="flex flex-col align-middle justify-between mb-5 text-left flex-1 p-5 bg-base-300 shadow-md rounded-lg">
					<h6 class="text-[#c5c8cb] text-sm">
						Currently up for
					</h6>
					<h4 class="text-white text-lg">
						<span v-if="hostInfo">{{ fmtDuration(hostInfo.uptime) }}</span>
						<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-3" />
					</h4>
				</div>
				<div class="flex flex-row items-center justify-between mb-5 text-left flex-1 p-5 bg-base-300 shadow-md rounded-lg">
					<div class="flex-1 flex flex-col align-middle justify-between">
						<h6 class="text-[#c5c8cb]">
							Incidents
						</h6>
						<h4 class="text-white text-lg">
							<span v-if="hostInfo">{{ incidentsCount }}<span v-if="incidentsCount > 100">+</span></span>
							<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-3" />
						</h4>
					</div>
					<router-link key="incidents" :to="{ name: 'Incidents' }" class="text-[#c5c8cb]">
						<svg
							xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8 rotate-180 hover:!fill-white transition duration-300" width="24" height="24"
							viewBox="0 0 24 24">
							<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
						</svg>
					</router-link>
				</div>
				<div class="flex flex-col align-middle justify-between mb-5 text-left flex-1 p-5 bg-base-300 shadow-md rounded-lg">
					<h6 class="text-[#c5c8cb]">
						Alerts
					</h6>
					<h4 class="text-white mt-2">
						<span v-if="hostInfo" class="badge p-4 text-white text-[15px] w-full">
							{{ alertsCount }} {{ alertsCount > 1 ? 'actives' : 'active' }}
						</span>
						<div v-else class="animate-pulse bg-slate-600 w-full rounded h-[22px] mt-3" />
					</h4>
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
			<CpuTimes :key="this.$route.params.uuid" :uuid="this.$route.params.uuid" :berta="this.$route.params.berta" :graph-range="graphRange" />
			<h3 class="text-2xl text-gray-100 mb-4 mt-4" id="loadavg">
				load
			</h3>
			<p class="text-sm text-gray-200">
				System load. The 3 metrics refer to 1, 5 and 15 minutes averages. Computed once every 5 seconds.
			</p>
			<LoadAvg :key="this.$route.params.uuid" :uuid="this.$route.params.uuid" :berta="this.$route.params.berta" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4">
			<h3 class="text-2xl text-gray-100 mb-4" id="ioblocks">
				disks
			</h3>
			<p class="text-sm text-gray-200">
				Total Disk I/O for all physical disks. Physical are disks present in <code>/sys/block</code> but don't have a <code>{}/device</code> in it.
			</p>
			<IoBlocksOverall :key="this.$route.params.uuid" :uuid="this.$route.params.uuid" :berta="this.$route.params.berta" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4">
			<h3 class="text-2xl text-gray-100 mb-4" id="ram">
				ram
			</h3>
			<p class="text-sm text-gray-200">
				System Random Access Memory (i.e. physical memory) usage.
			</p>
			<Ram :key="this.$route.params.uuid" :uuid="this.$route.params.uuid" :berta="this.$route.params.berta" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4">
			<h3 class="text-2xl text-gray-100 mb-4" id="swap">
				swap
			</h3>
			<p class="text-sm text-gray-200">
				System swap memory usage. Swap space is used when the RAM if full.
			</p>
			<Swap :key="this.$route.params.uuid" :uuid="this.$route.params.uuid" :berta="this.$route.params.berta" :graph-range="graphRange" />
		</div>
		<div role="section" class="mt-4 mb-16">
			<h3 class="text-2xl text-gray-100 mb-4" id="ionets">
				network
			</h3>
			<p class="text-sm text-gray-200">
				Total bandwidth of all physical network interfaces. Physical are all the network interfaces that are listed in <code>/proc/net/dev</code>, but do not exist in <code>/sys/devices/virtual/net</code>.
			</p>
			<IoNetsOverall :key="this.$route.params.uuid" :uuid="this.$route.params.uuid" :berta="this.$route.params.berta" :graph-range="graphRange" />
		</div>

		<button class="p-3 bg-base-300 rounded-md hover:bg-gray-800 focus:outline-none fixed bottom-8 right-8" @click="rangePickOpen = !rangePickOpen">
			<img src="@/assets/graph_custom.svg" class="w-6 h-6 inline-block">
		</button>

		<div v-if="rangePickOpen" class="relative z-10">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<div class="relative transform rounded-lg bg-base-300 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-6 py-4">
						<!-- Body -->
						<p class="text-lg text-gray-100 mb-4">
							Quick selector
						</p>
						<select class="form-select block w-full py-1" ref="scaleSelect">
							<option />
							<option :selected="selectedIdx == 1">
								Last 5 minutes (live)
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
						<p class="text-lg text-gray-100 my-4">
							Range selector
						</p>
						<DatePicker
							v-model="range" :max-date="tomorrow" :model-config="modelConfig" color="teal"
							is-range is-dark>
							<template #default="{ inputValue, isDragging, togglePopover }">
								<div class="flex flex-col sm:flex-row justify-start items-center">
									<div class="relative flex-grow">
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
									<span class="flex-shrink-0 m-2">
										<svg class="w-4 h-4 stroke-current text-gray-600" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
										</svg>
									</span>
									<div class="relative flex-grow">
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
						<div class="flex justify-between mt-4">
							<button @click="rangePickOpen = false">
								<svg
									class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
									viewBox="0 0 18 18">
									<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
								</svg>
							</button>
							<div>
								<button class="px-4 bg-transparent p-2 rounded-md text-green-400 hover:bg-gray-800 mr-2" @click="resetGraphRange()">
									Clear
								</button>
								<button class="px-4 bg-green-400 p-2 rounded-md text-white hover:bg-green-500" @click="applyRangeSelect()">
									Apply
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import moment from 'moment';
import Skeleton from '@/components/Graphs/Base/Skeleton'

import { DatePicker } from 'v-calendar'
import { useServersStore } from '@/stores/servers';
import { nextTick } from 'vue';
import { initWS, closeWS, CDC_VALUES } from '@/utils/websockets';
import { fmtDuration, fmtGranularity, isServerOnline, computeGranularity } from '@/utils/help';
import { defineAsyncComponent } from 'vue'

import 'v-calendar/dist/style.css';

const scaleIdxArr = [5, 15, 30, 60, 180, 360]

export default {
	name: 'DetailsServer',

	components: {
		DatePicker,
		CpuTimes: defineAsyncComponent({
			loader: () => import('@/components/Graphs/cpu/CpuTimes'),
			loadingComponent: Skeleton
		}),
		LoadAvg: defineAsyncComponent({
			loader: () => import('@/components/Graphs/cpu/LoadAvg'),
			loadingComponent: Skeleton
		}),
		IoBlocksOverall: defineAsyncComponent({
			loader: () => import('@/components/Graphs/disks/IoBlocksOverall'),
			loadingComponent: Skeleton
		}),
		Ram: defineAsyncComponent({
			loader: () => import('@/components/Graphs/memory/Ram'),
			loadingComponent: Skeleton
		}),
		Swap: defineAsyncComponent({
			loader: () => import('@/components/Graphs/memory/Swap'),
			loadingComponent: Skeleton
		}),
		IoNetsOverall: defineAsyncComponent({
			loader: () => import('@/components/Graphs/net/IoNetsOverall'),
			loadingComponent: Skeleton
		})
	},

	setup () {
		const store = useServersStore();
		return { store, fmtDuration, isServerOnline, fmtGranularity }
	},

	computed: {
		tomorrow() {
			let date = new Date();
			date.setDate(date.getDate() + 1);
			return date;
		}
	},

	data () {
		return {
			selectedIdx: 1,
			rangePickOpen: false,
			modelConfig: {
				type: 'string',
				mask: 'YYYY-MM-DD'
			},
			range: {
				start: null,
				end: null
			},
			graphRange: {
				granularity: 1,
				scale: 300,
				start: null,
				end: null
			},
			hostInfo: null,
			connection: null,
			incidentsCount: 0,
			alertsCount: 0,
			granularity: null,
		}
	},

	mounted: function () {
		const vm = this

		// Don't setup anything before everything is rendered
		nextTick(async () => {
			initWS(vm.$cdcBase(vm.$route.params.berta), "hosts", "update", ":uuid.eq." + vm.$route.params.uuid, false, vm);
			await vm.fetchInit();

			// The first few attempts can fails because the Base.vue WS may not have
			// already had the time to fetch all hosts/servers info.
			let retry = 0;
			do {
				const rkey = vm.store.configuredKeys.find((obj) => obj.uuid === vm.$route.params.uuid);
				if (rkey !== undefined) {
					vm.granularity = rkey.granularity;
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
			this.$refs.scaleSelect.selectedIndex = 1;
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
			if (this.range.start != null) {
				// TODO:
				// Define the trueRange in the format of YYYY-MM-DDTHH:mm:ss.SSS
				let start = moment(this.range.start);
				let end = moment(this.range.end)
				// Assume the scale will never be bigger than 1 info per seconds
				this.graphRange = {
					granularity: computeGranularity(moment.duration(end.diff(start)).asSeconds()),
					scale: end.diff(start, 'seconds'),
					start: start.format("YYYY-MM-DDTHH:mm:ss.SSS"),
					end: end.format("YYYY-MM-DDTHH:mm:ss.SSS")
				}
				console.log("Computed granularity is:", this.graphRange.granularity);
			} else {
				const scaleIdx = this.$refs.scaleSelect.selectedIndex;
				if (scaleIdx !== 0) {
					this.selectedIdx = scaleIdx;
					this.graphRange = {
						granularity: computeGranularity(scaleIdxArr[scaleIdx - 1] * 60),
						scale: scaleIdxArr[scaleIdx - 1] * 60,
						start: null,
						end: null
					}
					console.log("Computed granularity is:", this.graphRange.granularity);
				}
			}

			this.rangePickOpen = false;
		},
		convertToObject: function(jsonValues) {
			return {
				system: jsonValues[0],
				os_version: jsonValues[1],
				hostname: jsonValues[2],
				uptime: jsonValues[3],
				uuid: jsonValues[4],
				created_at: jsonValues[5],
				updated_at: jsonValues[6],
			}
		},
		fetchInit: async function() {
			await this.$http.get(this.$serverBase(this.$route.params.berta) + "/api/host?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.hostInfo = {
						system: resp.data.system,
						os_version: resp.data.os_version,
						hostname: resp.data.hostname,
						uptime: resp.data.uptime,
						uuid: resp.data.uuid,
						created_at: resp.data.created_at,
						updated_at: resp.data.updated_at,
					};
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
			await this.$http.get(this.$serverBase(this.$route.params.berta) + "/api/incidents_count?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.incidentsCount = resp.data ?? 0;
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
			await this.$http.get(this.$serverBase(this.$route.params.berta) + "/api/alerts_count?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.alertsCount = resp.data ?? 0;
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
			await this.$http.get(this.$serverBase(this.$route.params.berta) + "/api/incidents_count?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					this.incidentsCount = resp.data ?? 0;
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
				updated_at: jsonValues[6],
			};
		}
	}
}
</script>