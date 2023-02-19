<template>
	<section>
		<div class="md:flex justify-between">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Greetings 👋
				</h1>
			</div>
			<div class="mt-4 md:mt-0 flex flex-col items-start sm:flex-row sm:space-x-4">
				<div class="mb-3 relative self-stretch sm:mb-0 sm:self-end w-[265px]">
					<svg class="absolute left-[12px] top-[13px]" height="14" viewBox="0 0 14 14" width="14">
						<path
							stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"
							d="M13 13L9.61539 9.61539M11.0513 6.02564C11.0513 6.68562 10.9213 7.33913 10.6687 7.94887C10.4162 8.55861 10.046 9.11263 9.57931 9.57931C9.11263 10.046 8.55861 10.4162 7.94887 10.6687C7.33913 10.9213 6.68562 11.0513 6.02564 11.0513C5.36566 11.0513 4.71215 10.9213 4.10241 10.6687C3.49267 10.4162 2.93865 10.046 2.47198 9.57931C2.0053 9.11263 1.63512 8.55861 1.38255 7.94887C1.12999 7.33913 1 6.68562 1 6.02564C1 4.69276 1.52949 3.41447 2.47198 2.47198C3.41447 1.52949 4.69276 1 6.02564 1C7.35852 1 8.63682 1.52949 9.57931 2.47198C10.5218 3.41447 11.0513 4.69276 11.0513 6.02564Z" />
					</svg>

					<input
						type="text" placeholder="Search monitors"
						class="input input-bordered w-full bg-base-300 !pl-[34px] h-10"
						v-model="searchText" @input="filterList" style="font-size: 0.875rem;">
				</div>

				<router-link key="add_server" :to="{ name: 'NewServer' }" class="btn btn-info !h-10 !min-h-[2.5rem] normal-case">
					add a server
				</router-link>
			</div>
		</div>
		<section
			v-if="store.configuredKeys.length === 0 && store.unconfiguredKeys.length === 0"
			class="mt-12 flex justify-center items-center h-52">
			<div class="prose-sm max-w-sm">
				<h1>No servers.</h1>
				<p>Seems like you just created your account, welcome !</p>
				<p>You can add a new server with the button on the top, just follow the instructions.</p>
			</div>
		</section>
		<!-- In case we have unconfiguredKeys -->
		<section id="unconfiguredKeys" v-if="store.unconfiguredKeys.length !== 0" class="mt-12">
			<p class="p-4 text-[#c5c8cb]">
				Waiting activation...
			</p>
			<div class="bg-base-300 rounded-lg shadow servers-list">
				<div v-for="item in store.unconfiguredKeys" :key="item.key">
					<router-link
						:to="{ name: 'NewDetails', params: { secretKey: item.key } }" id="servers-item"
						class="flex justify-between cursor-pointer pl-4 pr-8 py-3 hover:bg-neutral-focus gap-4 rounded-lg text-[#c5c8cb] hover:text-[#d3d3d3] transition duration-300">
						<div class="flex items-center gap-4">
							<div class="status-indicator status-indicator--sm status-indicator--warning">
								<div class="circle circle--animated circle-main" />
								<div class="circle circle--animated circle-secondary" />
								<div class="circle circle--animated circle-tertiary" />
							</div>
							<div class="flex flex-col align-middle">
								<p class="text-white font-medium max-w-[340px] text-sm mb-[2px]">
									{{ trunkKey(item.key) }}...
								</p>
								<p class="text-[13px]">
									Key ready, waiting for data
								</p>
							</div>
						</div>
						<div class="flex items-center gap-4 text-gray-300">
							<div class="dropdown dropdown-end">
								<label @click.prevent tabindex="0" class="btn btn-square btn-ghost h-7 w-10 min-h-[1.75rem] !bg-opacity-30">
									<svg
										xmlns="http://www.w3.org/2000/svg" width="16" height="4" viewBox="0 0 16 4"
										fill="currentColor">
										<path d="M14 0C15.103 0 16 0.897 16 2C16 3.103 15.103 4 14 4C12.897 4 12 3.103 12 2C12 0.897 12.897 0 14 0ZM8 0C9.103 0 10 0.897 10 2C10 3.103 9.103 4 8 4C6.897 4 6 3.103 6 2C6 0.897 6.897 0 8 0ZM2 0C3.103 0 4 0.897 4 2C4 3.103 3.103 4 2 4C0.897 4 0 3.103 0 2C0 0.897 0.897 0 2 0Z" />
									</svg>
								</label>
								<div tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 bg-base-300 shadow rounded-box w-52 gap-1 border border-neutral">
									<li><a>Configure</a></li>
									<div class="divider h-0 my-0" />
									<li><label @click.stop :for="'delete-modal-' + trunkKey(item.key)">Delete</label></li>
								</div>
							</div>
						</div>
					</router-link>
					<!-- Item's modals (delete) -->
					<DeleteKeyModal :trunk-key="trunkKey(item.key)" :full-key="item.key" />
				</div>
			</div>
		</section>
		<!-- In case we have configuredKeys -->
		<section id="configuredKeys" v-if="store.configuredKeys.length !== 0" :class="store.unconfiguredKeys.length !== 0 ? 'mt-6' : 'mt-12'">
			<p class="p-4 text-[#c5c8cb]">
				Configured servers
			</p>
			<div
				v-if="searchText && filteredResult.length === 0 && store.configuredKeys.length !== 0"
				class="flex justify-center items-center h-52">
				<div class="prose-sm max-w-sm">
					<h1>No results.</h1>
					<p>Try another query, we've not found any servers name containing what you entered.</p>
				</div>
			</div>
			<div class="bg-base-300 rounded-lg shadow servers-list">
				<div v-if="!searchText && store.configuredKeys.length === 0" class="animate-pulse bg-slate-600 w-full rounded-lg h-[65.5px]" />
				<div v-for="item in (!searchText ? store.configuredKeys : filteredResult)" :key="item.uuid">
					<router-link
						:to="{ name: 'DetailsServer', params: { berta: item.berta, uuid: item.uuid, hostname: item.hostname } }"
						class="flex justify-between cursor-pointer pl-4 pr-8 py-3 hover:bg-neutral-focus gap-4 rounded-lg text-[#c5c8cb] hover:text-[#d3d3d3] transition duration-300">
						<div class="flex items-center gap-4">
							<div class="status-indicator status-indicator--sm" :class="true ? 'status-indicator--success' : 'status-indicator--danger'">
								<div class="circle circle--animated circle-main" />
								<div class="circle circle--animated circle-secondary" />
								<div class="circle circle--animated circle-tertiary" />
							</div>
							<div class="flex flex-col align-middle">
								<p class="text-white font-medium max-w-[340px] text-sm mb-[2px]">
									{{ item.hostname }}
								</p>
								<p class="text-[13px]">
									<span class="text-success mr-1">Up</span> - <span class="ml-1">{{ fmtDuration(item.uptime) }}</span>
								</p>
							</div>
						</div>
						<div class="flex items-center gap-4 text-gray-300">
							<div class="dropdown dropdown-end">
								<label @click.prevent tabindex="0" class="btn btn-square btn-ghost h-7 w-10 min-h-[1.75rem] !bg-opacity-30">
									<svg
										xmlns="http://www.w3.org/2000/svg" width="16" height="4" viewBox="0 0 16 4"
										fill="currentColor">
										<path d="M14 0C15.103 0 16 0.897 16 2C16 3.103 15.103 4 14 4C12.897 4 12 3.103 12 2C12 0.897 12.897 0 14 0ZM8 0C9.103 0 10 0.897 10 2C10 3.103 9.103 4 8 4C6.897 4 6 3.103 6 2C6 0.897 6.897 0 8 0ZM2 0C3.103 0 4 0.897 4 2C4 3.103 3.103 4 2 4C0.897 4 0 3.103 0 2C0 0.897 0.897 0 2 0Z" />
									</svg>
								</label>
								<div tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 bg-base-300 shadow rounded-box w-52 gap-1 border border-neutral">
									<li><a>Configure</a></li>
									<li><a>Incidents</a></li>
									<div class="divider h-0 my-0" />
									<li><label @click.stop :for="'delete-modal-' + trunkKey(item.key)">Delete</label></li>
								</div>
							</div>
						</div>
					</router-link>
					<!-- Item's modals (delete) -->
					<DeleteKeyModal :trunk-key="trunkKey(item.key)" :full-key="item.key" />
				</div>
			</div>
		</section>
	</section>
</template>

<script>
import { useServersStore } from '@/stores/servers';
import { trunkKey, fmtDuration, fmtGranularity } from '@/utils/help';

import DeleteKeyModal from '@/components/DeleteKeyModal'

export default {
	name: 'Home',
	components: {
		DeleteKeyModal,
	},

	setup () {
		const store = useServersStore();
		return { store, trunkKey, fmtDuration, fmtGranularity }
	},

	data () {
		return {
			filteredResult: [],
			searchText: ""
		}
	},

	methods: {
		filterList: function() {
			this.filteredResult = this.store.configuredKeys.filter((el) => el.hostname.match(this.searchText));
		},
	}
}
</script>